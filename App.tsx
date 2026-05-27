import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

/**
 * Video Analysis & Annotation Tool.
 *
 * Upload a video in the browser, scrub the timeline, and drop timestamped
 * "highlight" annotations onto it. Annotations are categorised, listed,
 * seekable, editable, and exportable as JSON. Runs fully client-side — the
 * selected file never leaves the browser (it is loaded via an object URL).
 */

type CategoryId = 'key' | 'action' | 'issue' | 'question' | 'note';

interface Annotation {
  id: string;
  time: number; // seconds into the video
  title: string;
  note: string;
  category: CategoryId;
}

interface CategoryMeta {
  id: CategoryId;
  label: string;
  color: string;
}

const CATEGORIES: CategoryMeta[] = [
  { id: 'key', label: 'Key moment', color: '#e19b46' },
  { id: 'action', label: 'Action item', color: '#2f9e6f' },
  { id: 'issue', label: 'Issue', color: '#d9534f' },
  { id: 'question', label: 'Question', color: '#5b8def' },
  { id: 'note', label: 'Note', color: '#8a6856' },
];

const categoryMeta = (id: CategoryId): CategoryMeta =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[4];

const COLORS = {
  bg: '#0f1115',
  panel: '#181b22',
  panelAlt: '#1f232c',
  border: '#2a2f3a',
  text: '#f4f6fa',
  textMuted: '#9aa3b2',
  accent: '#5b8def',
  danger: '#d9534f',
  white: '#ffffff',
};

const isWeb = Platform.OS === 'web';

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default function App() {
  if (!isWeb) {
    return (
      <View style={styles.fallback}>
        <StatusBar style="light" />
        <Text style={styles.fallbackTitle}>Video Annotation Tool</Text>
        <Text style={styles.fallbackBody}>
          This tool runs in the browser. Open the web build to upload a video and
          create annotation highlights.
        </Text>
      </View>
    );
  }
  return <AnnotationTool />;
}

function AnnotationTool() {
  const videoRef = useRef<any>(null);
  const fileInputRef = useRef<any>(null);
  const timelineWidth = useRef(0);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftNote, setDraftNote] = useState('');
  const [draftCategory, setDraftCategory] = useState<CategoryId>('key');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingTime, setPendingTime] = useState<number | null>(null);

  // Attach native <video> DOM event listeners whenever the source changes.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onLoaded = () => setDuration(el.duration || 0);
    const onTime = () => setCurrentTime(el.currentTime || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    el.addEventListener('loadedmetadata', onLoaded);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('loadedmetadata', onLoaded);
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onEnded);
    };
  }, [videoUrl]);

  // Release the previous object URL when it is replaced or on unmount.
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const handleFile = useCallback(
    (file: File | undefined | null) => {
      if (!file) return;
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setFileName(file.name);
      setAnnotations([]);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      resetDraft();
    },
    [videoUrl],
  );

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const seekTo = useCallback((time: number) => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = Math.max(0, time);
    setCurrentTime(el.currentTime);
  }, []);

  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) el.play();
    else el.pause();
  }, []);

  const resetDraft = () => {
    setDraftTitle('');
    setDraftNote('');
    setDraftCategory('key');
    setEditingId(null);
    setPendingTime(null);
  };

  const startNewAnnotation = useCallback(() => {
    const el = videoRef.current;
    if (el && !el.paused) el.pause();
    setEditingId(null);
    setPendingTime(el ? el.currentTime : currentTime);
    setDraftTitle('');
    setDraftNote('');
    setDraftCategory('key');
  }, [currentTime]);

  const startEditing = useCallback((a: Annotation) => {
    setEditingId(a.id);
    setPendingTime(a.time);
    setDraftTitle(a.title);
    setDraftNote(a.note);
    setDraftCategory(a.category);
  }, []);

  const saveDraft = useCallback(() => {
    if (pendingTime === null) return;
    const title = draftTitle.trim() || 'Untitled highlight';
    if (editingId) {
      setAnnotations((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? { ...a, title, note: draftNote.trim(), category: draftCategory }
            : a,
        ),
      );
    } else {
      const next: Annotation = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        time: pendingTime,
        title,
        note: draftNote.trim(),
        category: draftCategory,
      };
      setAnnotations((prev) => [...prev, next]);
    }
    resetDraft();
  }, [pendingTime, draftTitle, draftNote, draftCategory, editingId]);

  const deleteAnnotation = useCallback(
    (id: string) => {
      setAnnotations((prev) => prev.filter((a) => a.id !== id));
      if (editingId === id) resetDraft();
    },
    [editingId],
  );

  const exportJson = useCallback(() => {
    const payload = {
      file: fileName,
      duration,
      exportedAt: new Date().toISOString(),
      annotations: [...annotations]
        .sort((a, b) => a.time - b.time)
        .map((a) => ({
          time: a.time,
          timecode: formatTime(a.time),
          category: a.category,
          title: a.title,
          note: a.note,
        })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(fileName || 'video').replace(/\.[^.]+$/, '')}-annotations.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [annotations, fileName, duration]);

  const sortedAnnotations = useMemo(
    () => [...annotations].sort((a, b) => a.time - b.time),
    [annotations],
  );

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const onTimelinePress = (e: any) => {
    if (duration <= 0 || timelineWidth.current <= 0) return;
    const x = e.nativeEvent?.locationX ?? 0;
    const ratio = Math.min(1, Math.max(0, x / timelineWidth.current));
    seekTo(ratio * duration);
  };

  // The native file input + video element are DOM nodes (web target).
  const fileInput = React.createElement('input', {
    ref: fileInputRef,
    type: 'file',
    accept: 'video/*',
    style: { display: 'none' },
    onChange: (e: any) => handleFile(e.target.files?.[0]),
  });

  const videoEl = videoUrl
    ? React.createElement('video', {
        ref: videoRef,
        src: videoUrl,
        controls: false,
        playsInline: true,
        onClick: togglePlay,
        style: {
          width: '100%',
          maxHeight: 460,
          display: 'block',
          background: '#000',
          borderRadius: 8,
          cursor: 'pointer',
        },
      })
    : null;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {fileInput}

      <View style={styles.header}>
        <Text style={styles.brand}>Video Analysis & Annotation</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.ghostBtn} onPress={openFilePicker}>
            <Text style={styles.ghostBtnText}>
              {videoUrl ? 'Replace video' : 'Upload video'}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.primaryBtn, annotations.length === 0 && styles.btnDisabled]}
            disabled={annotations.length === 0}
            onPress={exportJson}
          >
            <Text style={styles.primaryBtnText}>Export JSON</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {!videoUrl ? (
          <Pressable style={styles.dropZone} onPress={openFilePicker}>
            <Text style={styles.dropTitle}>Upload a video to begin</Text>
            <Text style={styles.dropHint}>
              Click here to choose a video file. It is processed entirely in your
              browser — nothing is uploaded to a server.
            </Text>
            <View style={styles.dropBtn}>
              <Text style={styles.dropBtnText}>Choose file</Text>
            </View>
          </Pressable>
        ) : (
          <View style={styles.layout}>
            {/* Player column */}
            <View style={styles.playerCol}>
              <View style={styles.videoWrap}>{videoEl}</View>

              {/* Transport + timeline */}
              <View style={styles.transport}>
                <Pressable style={styles.playBtn} onPress={togglePlay}>
                  <Text style={styles.playBtnText}>{isPlaying ? '❚❚' : '►'}</Text>
                </Pressable>
                <Text style={styles.timeLabel}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Text>
                <Pressable style={styles.addBtn} onPress={startNewAnnotation}>
                  <Text style={styles.addBtnText}>+ Add highlight</Text>
                </Pressable>
              </View>

              <Pressable
                style={styles.timeline}
                onPress={onTimelinePress}
                onLayout={(e) => (timelineWidth.current = e.nativeEvent.layout.width)}
              >
                <View style={styles.timelineTrack} />
                <View style={[styles.timelineFill, { width: `${progressPct}%` }]} />
                <View style={[styles.playhead, { left: `${progressPct}%` }]} />
                {duration > 0 &&
                  sortedAnnotations.map((a) => (
                    <Pressable
                      key={a.id}
                      onPress={() => seekTo(a.time)}
                      style={[
                        styles.marker,
                        {
                          left: `${(a.time / duration) * 100}%`,
                          backgroundColor: categoryMeta(a.category).color,
                        },
                      ]}
                    />
                  ))}
              </Pressable>

              <View style={styles.legend}>
                {CATEGORIES.map((c) => (
                  <View key={c.id} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: c.color }]} />
                    <Text style={styles.legendText}>{c.label}</Text>
                  </View>
                ))}
              </View>

              {/* Draft / edit form */}
              {pendingTime !== null && (
                <View style={styles.form}>
                  <Text style={styles.formHeading}>
                    {editingId ? 'Edit highlight' : 'New highlight'} at{' '}
                    {formatTime(pendingTime)}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Title"
                    placeholderTextColor={COLORS.textMuted}
                    value={draftTitle}
                    onChangeText={setDraftTitle}
                  />
                  <TextInput
                    style={[styles.input, styles.inputMultiline]}
                    placeholder="Note (optional)"
                    placeholderTextColor={COLORS.textMuted}
                    value={draftNote}
                    onChangeText={setDraftNote}
                    multiline
                  />
                  <View style={styles.chipRow}>
                    {CATEGORIES.map((c) => {
                      const active = c.id === draftCategory;
                      return (
                        <Pressable
                          key={c.id}
                          onPress={() => setDraftCategory(c.id)}
                          style={[
                            styles.chip,
                            { borderColor: c.color },
                            active && { backgroundColor: c.color },
                          ]}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              active && styles.chipTextActive,
                            ]}
                          >
                            {c.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <View style={styles.formActions}>
                    <Pressable style={styles.ghostBtn} onPress={resetDraft}>
                      <Text style={styles.ghostBtnText}>Cancel</Text>
                    </Pressable>
                    <Pressable style={styles.primaryBtn} onPress={saveDraft}>
                      <Text style={styles.primaryBtnText}>
                        {editingId ? 'Save changes' : 'Add highlight'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>

            {/* Annotations column */}
            <View style={styles.listCol}>
              <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Highlights</Text>
                <Text style={styles.listCount}>{annotations.length}</Text>
              </View>
              {sortedAnnotations.length === 0 ? (
                <Text style={styles.emptyText}>
                  No highlights yet. Play the video and tap “Add highlight” to
                  capture the current moment.
                </Text>
              ) : (
                sortedAnnotations.map((a) => {
                  const meta = categoryMeta(a.category);
                  return (
                    <View key={a.id} style={styles.card}>
                      <View
                        style={[styles.cardAccent, { backgroundColor: meta.color }]}
                      />
                      <View style={styles.cardBody}>
                        <View style={styles.cardTop}>
                          <Pressable onPress={() => seekTo(a.time)}>
                            <Text style={[styles.cardTime, { color: meta.color }]}>
                              {formatTime(a.time)}
                            </Text>
                          </Pressable>
                          <Text style={styles.cardCat}>{meta.label}</Text>
                        </View>
                        <Text style={styles.cardTitle}>{a.title}</Text>
                        {a.note.length > 0 && (
                          <Text style={styles.cardNote}>{a.note}</Text>
                        )}
                        <View style={styles.cardActions}>
                          <Pressable onPress={() => seekTo(a.time)}>
                            <Text style={styles.cardAction}>Jump</Text>
                          </Pressable>
                          <Pressable onPress={() => startEditing(a)}>
                            <Text style={styles.cardAction}>Edit</Text>
                          </Pressable>
                          <Pressable onPress={() => deleteAnnotation(a.id)}>
                            <Text style={[styles.cardAction, styles.cardActionDanger]}>
                              Delete
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg, width: '100%' },
  fallback: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  fallbackTitle: { color: COLORS.text, fontSize: 22, fontWeight: '700', marginBottom: 12 },
  fallbackBody: { color: COLORS.textMuted, fontSize: 15, textAlign: 'center', maxWidth: 420 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.panel,
  },
  brand: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  headerActions: { flexDirection: 'row', gap: 10 },

  body: { flex: 1 },
  bodyContent: { padding: 24, maxWidth: 1180, width: '100%', alignSelf: 'center' },

  dropZone: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 64,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: COLORS.panel,
  },
  dropTitle: { color: COLORS.text, fontSize: 20, fontWeight: '700', marginBottom: 8 },
  dropHint: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 460,
    marginBottom: 20,
    lineHeight: 20,
  },
  dropBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 8,
  },
  dropBtnText: { color: COLORS.white, fontWeight: '600', fontSize: 15 },

  layout: { flexDirection: 'row', gap: 24, flexWrap: 'wrap' },
  playerCol: { flexGrow: 1, flexShrink: 1, flexBasis: 560, minWidth: 320 },
  listCol: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 320,
    minWidth: 280,
    backgroundColor: COLORS.panel,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },

  videoWrap: { borderRadius: 8, overflow: 'hidden', backgroundColor: '#000' },

  transport: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 14,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  timeLabel: { color: COLORS.textMuted, fontSize: 14, fontVariant: ['tabular-nums'] },
  addBtn: {
    marginLeft: 'auto',
    backgroundColor: COLORS.panelAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addBtnText: { color: COLORS.text, fontWeight: '600', fontSize: 14 },

  timeline: {
    height: 26,
    marginTop: 16,
    justifyContent: 'center',
    position: 'relative',
  },
  timelineTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.panelAlt,
    top: 10,
  },
  timelineFill: {
    position: 'absolute',
    left: 0,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
    top: 10,
  },
  playhead: {
    position: 'absolute',
    width: 3,
    height: 18,
    backgroundColor: COLORS.white,
    borderRadius: 2,
    top: 4,
    marginLeft: -1,
  },
  marker: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    top: 8,
    marginLeft: -5,
    borderWidth: 1,
    borderColor: COLORS.bg,
  },

  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: COLORS.textMuted, fontSize: 12 },

  form: {
    marginTop: 20,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
  },
  formHeading: { color: COLORS.text, fontSize: 15, fontWeight: '700', marginBottom: 12 },
  input: {
    backgroundColor: COLORS.panelAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 10,
  },
  inputMultiline: { minHeight: 64, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { color: COLORS.text, fontSize: 13 },
  chipTextActive: { color: COLORS.white, fontWeight: '700' },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  listCount: {
    color: COLORS.textMuted,
    fontSize: 13,
    backgroundColor: COLORS.panelAlt,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyText: { color: COLORS.textMuted, fontSize: 14, lineHeight: 20 },

  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.panelAlt,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  cardAccent: { width: 4 },
  cardBody: { flex: 1, padding: 12 },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTime: { fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  cardCat: { color: COLORS.textMuted, fontSize: 12 },
  cardTitle: { color: COLORS.text, fontSize: 15, fontWeight: '600', marginBottom: 2 },
  cardNote: { color: COLORS.textMuted, fontSize: 13, lineHeight: 18, marginTop: 2 },
  cardActions: { flexDirection: 'row', gap: 16, marginTop: 10 },
  cardAction: { color: COLORS.accent, fontSize: 13, fontWeight: '600' },
  cardActionDanger: { color: COLORS.danger },

  ghostBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.panelAlt,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  ghostBtnText: { color: COLORS.text, fontWeight: '600', fontSize: 14 },
  primaryBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  primaryBtnText: { color: COLORS.white, fontWeight: '600', fontSize: 14 },
  btnDisabled: { opacity: 0.4 },
});
