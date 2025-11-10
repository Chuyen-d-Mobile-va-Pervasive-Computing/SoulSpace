"use client";

import Heading from "@/components/Heading";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TouchableOpacity, Vibration, View, ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type WordItem = { id: string; word: string; clue: string };
type Pos = { r: number; c: number };

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

function generateCrosswordLayout(words: WordItem[]): string[][] {
  const size = 15;
  const grid = Array(size).fill(null).map(() => Array(size).fill(""));
  const center = Math.floor(size / 2);
  const first = words[0].word.toUpperCase();
  const startCol = center - Math.floor(first.length / 2);
  for (let i = 0; i < first.length; i++) grid[center][startCol + i] = first[i];

  const canPlace = (r: number, c: number, w: string, vertical: boolean) => {
    for (let i = 0; i < w.length; i++) {
      const rr = r + (vertical ? i : 0);
      const cc = c + (vertical ? 0 : i);
      if (rr < 0 || cc < 0 || rr >= size || cc >= size) return false;
      if (grid[rr][cc] && grid[rr][cc] !== w[i]) return false;
    }
    return true;
  };

  for (let w = 1; w < words.length; w++) {
    const word = words[w].word.toUpperCase();
    let placed = false;
    for (let r = 0; r < size && !placed; r++) {
      for (let c = 0; c < size && !placed; c++) {
        const letter = grid[r][c];
        if (!letter) continue;

        const matchIdx = [...word].map((ch, i) => (ch === letter ? i : -1)).filter((i) => i >= 0);
        for (const idx of matchIdx) {
          const startRow = r - idx;
          const startCol = c;
          if (canPlace(startRow, startCol, word, true)) {
            for (let i = 0; i < word.length; i++) grid[startRow + i][startCol] = word[i];
            placed = true;
            break;
          }
          const startRow2 = r;
          const startCol2 = c - idx;
          if (canPlace(startRow2, startCol2, word, false)) {
            for (let i = 0; i < word.length; i++) grid[startRow2][startCol2 + i] = word[i];
            placed = true;
            break;
          }
        }
      }
    }
    if (!placed) {
      for (let r = 0; r < size && !placed; r++) {
        for (let c = 0; c < size && !placed; c++) {
          if (canPlace(r, c, word, false)) {
            for (let i = 0; i < word.length; i++) grid[r][c + i] = word[i];
            placed = true;
          }
        }
      }
    }
  }

  const minRow = grid.findIndex((r) => r.some((ch) => ch));
  const maxRow = grid.length - [...grid].reverse().findIndex((r) => r.some((ch) => ch)) - 1;
  const minCol = Math.min(...grid.map((r) => (r.findIndex((ch) => ch) >= 0 ? r.findIndex((ch) => ch) : size)));
  const maxCol = Math.max(...grid.map((r) => r.map((ch, i) => (ch ? i : -1)).reduce((a, b) => Math.max(a, b), -1)));

  return grid.slice(minRow, maxRow + 1).map((r) => r.slice(minCol, maxCol + 1));
}

function posEqual(a: Pos, b: Pos) { return a.r === b.r && a.c === b.c; }
function isSameLine(poses: Pos[]) {
  if (poses.length < 2) return true;
  const rows = poses.map(p => p.r);
  const cols = poses.map(p => p.c);
  const sameRow = rows.every(r => r === rows[0]);
  const sameCol = cols.every(c => c === cols[0]);
  return sameRow || sameCol || Math.abs(rows[poses.length-1]-rows[0])===Math.abs(cols[poses.length-1]-cols[0]); 
}

function isContiguous(poses: Pos[]) {
  if (poses.length<2) return true; 
  const byRow=poses.every(p=>p.r===poses[0].r);
  const byCol=poses.every(p=>p.c===poses[0].c);
  let sorted=[...poses];
  if (byRow) {
    sorted.sort((a,b)=>a.c-b.c);
    return sorted.every((p,i)=>i===0||sorted[i].c-sorted[i-1].c===1);
  }
  if (byCol) {
    sorted.sort((a,b)=>a.r-b.r);
    return sorted.every((p,i)=>i===0||sorted[i].r-sorted[i-1].r===1);
  }
  sorted.sort((a,b)=>a.r-b.r);
  return sorted.every(
    (p,i)=>
      i===0||
    (Math.abs(sorted[i].r-sorted[i-1].r)===1&&
    Math.abs(sorted[i].c-sorted[i-1].c)===1)
  ); 
}

function positionsToWord(poses: Pos[], grid: string[][]) {
  if(poses.length===0) return "";
  const byRow=poses.every(p=>p.r===poses[0].r);
  const byCol=poses.every(p=>p.c===poses[0].c);
  const sorted=[...poses].sort((a,b)=>
    byRow?a.c-b.c:byCol?a.r-b.r:a.r-b.r||a.c-b.c);
  return sorted.map(p=>grid[p.r][p.c]).join(""); }

export default function CrossyWordsAuto() {
  const [words, setWords] = useState<WordItem[]>([]);
  const [grid, setGrid] = useState<string[][]>([]);
  const [selected, setSelected] = useState<Pos[]>([]);
  const [found, setFound] = useState<{ word: string; positions: Pos[] }[]>([]);
  const [feedback, setFeedback] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get("window").width;
  const tileSize = Math.min(44, (screenWidth - 80) / 10);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        const res = await fetch(`${API_BASE}/api/v1/game/crossword/words`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          ToastAndroid.show(data?.detail || data?.error || "Failed to load words", ToastAndroid.LONG);
          setLoading(false);
          return;
        }
        if (!Array.isArray(data) || data.length === 0) {
          ToastAndroid.show("No words available", ToastAndroid.LONG);
          setLoading(false);
          return;
        }
        setWords(data);
        setGrid(generateCrosswordLayout(data));
      } catch (err: any) {
        ToastAndroid.show(err.message || "Network error", ToastAndroid.LONG);
      } finally {
        setLoading(false);
      }
    };
    fetchWords();
  }, []);

  const candidate = useMemo(() => {
    if (!selected.length || !isSameLine(selected) || !isContiguous(selected)) return "";
    return positionsToWord(selected, grid).toUpperCase();
  }, [selected, grid]);

  // Check candidate word
  useEffect(() => {
    if (!candidate || candidate.length < 2) return;
    const match = words.find((w) => w.word.toUpperCase() === candidate);
    if (!match) {
      setFeedback("Not a word");
      const timer = setTimeout(() => setFeedback(""), 700);
      return () => clearTimeout(timer);
    }
    if (!found.find(f => f.word === match.word)) {
      setFound(prev => [...prev, { word: match.word, positions: [...selected] }]);
      setFeedback(`${match.word}`);
      Vibration.vibrate(50);
      const timer = setTimeout(() => { setSelected([]); setFeedback(""); }, 700);
      return () => clearTimeout(timer);
    } else setSelected([]);
  }, [candidate]);

  useEffect(() => {
    if (found.length === words.length && words.length > 0) {
      setCompleted(true);
      Vibration.vibrate(200);
    }
  }, [found, words]);

  const onTilePress = (r: number, c: number) => {
    if (!grid[r] || !grid[r][c]) return;
    const idx = selected.findIndex(p => posEqual(p, { r, c }));
    if (idx >= 0) return setSelected(prev => prev.filter((_, i) => i !== idx));
    const newSel = [...selected, { r, c }];
    if (!isSameLine(newSel) || !isContiguous(newSel)) {
      setFeedback("Choose tiles in a straight continuous line");
      Vibration.vibrate(50);
      setTimeout(() => setFeedback(""), 700);
      return;
    }
    setSelected(newSel);
  };

  const isTileFound = (r: number, c: number) => found.some(f => f.positions.some(p => posEqual(p, { r, c })));

  if (loading) {
    return <View className="flex-1 bg-[#FAF9FF] items-center justify-center"><Text>Loading...</Text></View>;
  }
  if (!words.length) {
    return <View className="flex-1 bg-[#FAF9FF] items-center justify-center"><Text>No words available</Text></View>;
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS==="ios"?"padding":undefined} className="flex-1 items-center bg-[#FAF9FF]">
      <Heading title="" />
      <Text className="text-[22px] font-[Poppins-Bold] text-[#7F56D9] mb-1 mt-2">Crossy Words</Text>
      <Text className="text-gray-500 mb-3">Tap letters in line (horizontal / vertical / diagonal)</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="bg-white p-3 rounded-xl shadow-sm">
          {grid.map((row, r) => (
            <View key={r} className="flex-row">
              {row.map((ch, c) => {
                const sel = selected.some(p => posEqual(p, { r, c }));
                const foundTile = isTileFound(r, c);
                const empty = !ch;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => onTilePress(r, c)}
                    activeOpacity={0.85}
                    style={{
                      width: tileSize,
                      height: tileSize,
                      margin: 2,
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: empty ? "transparent" : foundTile ? "#D5FFD9" : sel ? "#7F56D9" : "#FFFFFF",
                      borderWidth: empty ? 0 : 1,
                      borderColor: sel ? "#7F56D9" : "#E5E7EB",
                    }}
                  >
                    <Text className={`font-[Poppins-Bold] ${sel ? "text-white" : foundTile ? "text-[#00966D]" : "text-[#111]"}`}>
                      {ch || ""}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="mt-3 items-center min-h-[28px]">
        <Text className="text-lg font-[Poppins-Bold]">{candidate || "\u00A0"}</Text>
        {feedback ? <Text className={`mt-1 ${feedback.startsWith("✅")?"text-green-600":"text-red-600"}`}>{feedback}</Text> : null}
      </View>

      <View className="w-[92%] bg-white rounded-xl p-3 mt-3 mb-8">
        <Text className="font-[Poppins-Bold] text-[#7F56D9] mb-2">Clues</Text>
        {words.map((w, i) => {
          const done = found.some(f => f.word === w.word);
          return <Text key={w.id} className={`mb-1 ${done?"text-gray-400 line-through":"text-gray-700"}`}>{i+1}. {w.clue}</Text>;
        })}
      </View>

      <Modal visible={completed} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 w-[80%] items-center">
            <Text className="text-2xl font-[Poppins-Bold] text-[#7F56D9] mb-2">🎉 Great!</Text>
            <Text className="text-gray-600 mb-5 text-center">You have found all {words.length} words!</Text>
            <TouchableOpacity 
              onPress={()=>router.push("/(tabs)/home/minigame")} 
              className="bg-[#7F56D9] px-6 py-3 rounded-xl" 
              activeOpacity={0.8}
            >
              <Text className="text-white font-[Poppins-Bold] text-lg">Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}