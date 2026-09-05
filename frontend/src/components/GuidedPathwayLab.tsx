"use client";

import React, { useState } from "react";
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Zap, 
  Cpu, 
  Activity, 
  ShieldAlert, 
  HelpCircle, 
  Sliders, 
  Layers,
  Sparkles,
  Trophy,
  Check
} from "lucide-react";
import { ClientSimulator, SimulationResult } from "@/lib/simulator";
import StateVectorVisualizer from "./StateVectorVisualizer";
import D3EnergyLandscape from "./D3EnergyLandscape";
import InternalStateStepVisualizer from "./InternalStateStepVisualizer";

interface StageConfig {
  id: number;
  name: string;
  badge: string;
  objective: string;
  explanation: string;
  modelType: string;
  defaultL: number;
  defaultM: number;
  defaultP: number;
  defaultK: number;
  activeControl: "L" | "M" | "P" | "K" | "model" | "scrubber" | "all";
  controlPrompt: string;
  consequence: string;
  question: {
    prompt: string;
    options: { text: string; correct: boolean; feedback: string }[];
  };
}

const STAGES: StageConfig[] = [
  {
    id: 1,
    name: "1. REMEMBER",
    badge: "Basic Associative Binding",
    objective: "Observe how a memory state writes a Key-Value association and retains it under clean conditions.",
    explanation: "When a model reads `KEY:VALUE`, it writes an associative outer product into its state matrix. With zero noise and short sequences, retrieval is exact.",
    modelType: "educational_evolving_memory_toy",
    defaultL: 20,
    defaultM: 4,
    defaultP: 0.0,
    defaultK: 1,
    activeControl: "all",
    controlPrompt: "Keep noise at 0% and test clean retrieval of the target key.",
    consequence: "The model outputs an EXACT MATCH with high Signal-to-Noise Ratio (>35 dB).",
    question: {
      prompt: "What mathematical operation binds key-value pairs into the state?",
      options: [
        { text: "Outer-product update: S_t = S_{t-1} + Δ_t (v_t ⊗ k_t^T)", correct: true, feedback: "Correct! The outer product creates an associative rank-1 update in the state matrix." },
        { text: "Appending tokens to an infinite disk array", correct: false, feedback: "Incorrect. That describes a KV cache, not a fixed-size evolving state." },
        { text: "Randomly overwriting existing memory weights", correct: false, feedback: "Incorrect. Random updates would destroy information." }
      ]
    }
  },
  {
    id: 2,
    name: "2. STRETCH",
    badge: "Horizon Dilation & Decay",
    objective: "Discover why standard RNNs forget over long sequences, while selective gating preserves memory.",
    explanation: "As sequence length stretches to 150+ tokens, fixed recurrent networks with static decay (λ < 1) exponentially attenuate old bindings. Selective gating (Δ_t ≈ 0) preserves memory indefinitely.",
    modelType: "fixed_size_recurrent_memory",
    defaultL: 160,
    defaultM: 4,
    defaultP: 0.0,
    defaultK: 1,
    activeControl: "model",
    controlPrompt: "Toggle between Fixed-Size Recurrent and Educational Evolving Toy at L=160 tokens.",
    consequence: "Fixed Recurrent collapses into catastrophic forgetting, while Evolving Toy maintains 100% accuracy.",
    question: {
      prompt: "Why does the Fixed-Size Recurrent model fail when L > 30?",
      options: [
        { text: "Static exponential decay λ^T shrinks the original signal toward zero.", correct: true, feedback: "Correct! Constant attenuation without selective gating erases early prefix bindings." },
        { text: "The model runs out of RAM.", correct: false, feedback: "Incorrect. Recurrent models have constant O(1) memory footprint." },
        { text: "The sequence contains too many vowels.", correct: false, feedback: "Incorrect." }
      ]
    }
  },
  {
    id: 3,
    name: "3. ATTACK",
    badge: "Interference & Crosstalk",
    objective: "See how conflicting updates perturb stored state coordinates and degrade single-pass retrieval.",
    explanation: "When intermediate tokens overwrite existing keys, they inject conflicting projections into the same subspace, reducing SNR and corrupting direct 1-step readout.",
    modelType: "educational_evolving_memory_toy",
    defaultL: 80,
    defaultM: 6,
    defaultP: 0.55,
    defaultK: 1,
    activeControl: "P",
    controlPrompt: "Increase Interference Strength (p) to 55% with 1-pass inference (K=1).",
    consequence: "State SNR drops below 10 dB and the single-step model readout fails with a MISMATCH.",
    question: {
      prompt: "What physically causes interference in a bounded state matrix?",
      options: [
        { text: "Conflicting updates write non-orthogonal coordinates into the shared subspace.", correct: true, feedback: "Correct! Subspace superposition leads to dot-product cross-talk." },
        { text: "The model forgets its system prompt.", correct: false, feedback: "Incorrect." },
        { text: "Loss of internet connection.", correct: false, feedback: "Incorrect." }
      ]
    }
  },
  {
    id: 4,
    name: "4. RECOVER",
    badge: "Inference-Time Scaling",
    objective: "Witness how additional inference computation (K > 1) de-noises cross-talk and recovers the answer.",
    explanation: "Rather than guessing in a single pass, BDH Continuous Querying (CQ) relaxes the probe along the state energy landscape ∇_q E, settling into the true memory attractor well.",
    modelType: "educational_evolving_memory_toy",
    defaultL: 80,
    defaultM: 6,
    defaultP: 0.55,
    defaultK: 8,
    activeControl: "K",
    controlPrompt: "Keep interference at 55% but increase Inference Effort (K) from 1 to 8 cycles.",
    consequence: "The D3 energy landscape settles and the model successfully recovers the EXACT MATCH!",
    question: {
      prompt: "How does test-time deliberation (K > 1) recover the correct value?",
      options: [
        { text: "Iterative gradient descent sharpens the query probe toward the energy minimum.", correct: true, feedback: "Correct! Continuous Querying acts as an associative de-noising filter." },
        { text: "It asks another LLM for the answer.", correct: false, feedback: "Incorrect." },
        { text: "It doubles the model's parameter weights permanently.", correct: false, feedback: "Incorrect. Weights remain fixed; only inference compute scales." }
      ]
    }
  },
  {
    id: 5,
    name: "5. LOOK INSIDE",
    badge: "Dimensional State Inspection",
    objective: "Trace the step-by-step coordinate transitions and locate exactly where interference struck.",
    explanation: "Every state dimension d_0 to d_15 represents an abstract linear algebraic projection coordinate. Stepping through the sequence highlights the specific dimensions perturbed by interference.",
    modelType: "educational_evolving_memory_toy",
    defaultL: 40,
    defaultM: 4,
    defaultP: 0.4,
    defaultK: 4,
    activeControl: "scrubber",
    controlPrompt: "Use the step controls below to locate the step where interference illuminated affected dimensions.",
    consequence: "Affected coordinates d_0, d_1, d_2 pulse amber, showing exact mathematical deltas.",
    question: {
      prompt: "What do the visual dimensions d_0 through d_15 represent?",
      options: [
        { text: "Abstract linear algebraic coordinate projections in R^d (NOT biological neurons).", correct: true, feedback: "Correct! We enforce strict scientific integrity: these are mathematical coordinates." },
        { text: "Individual biological brain neurons.", correct: false, feedback: "Incorrect. Neural network state dimensions are not biological neurons." },
        { text: "Hard drive sectors.", correct: false, feedback: "Incorrect." }
      ]
    }
  },
  {
    id: 6,
    name: "6. MEET BDH",
    badge: "Architectural Standard & Boundary",
    objective: "Understand the BDH foundation standard and why our educational model is a micro-surrogate.",
    explanation: "Official BDH scales continuous state spaces across multi-GPU foundation clusters. Our educational toy (d=32) provides transparent client-side exploration without hidden weights.",
    modelType: "educational_evolving_memory_toy",
    defaultL: 64,
    defaultM: 6,
    defaultP: 0.2,
    defaultK: 4,
    activeControl: "all",
    controlPrompt: "Inspect the scientific boundary between production BDH and educational surrogates.",
    consequence: "Transparent separation maintains absolute scientific integrity.",
    question: {
      prompt: "What is the designated role of our Educational Toy Model?",
      options: [
        { text: "Pedagogical dissection and parameter exploration of core mathematical laws.", correct: true, feedback: "Correct! It isolates the fundamental mechanics of evolving state compression." },
        { text: "A 70-billion parameter production foundation model.", correct: false, feedback: "Incorrect. It is a lightweight educational surrogate." },
        { text: "A closed-source proprietary secret.", correct: false, feedback: "Incorrect." }
      ]
    }
  },
  {
    id: 7,
    name: "7. CHALLENGE THE CLAIM",
    badge: "Falsification & Physical Limits",
    objective: "Test the extreme boundary where capacity collapses and inference scaling fails.",
    explanation: "The central falsifiable claim states inference scaling helps *sometimes*, not always. When capacity is saturated (M=24) and interference is extreme (p=80%), signal is erased into white noise.",
    modelType: "educational_evolving_memory_toy",
    defaultL: 120,
    defaultM: 24,
    defaultP: 0.8,
    defaultK: 16,
    activeControl: "all",
    controlPrompt: "Set Capacity to max (M=24) and Interference to 80% with max compute (K=16).",
    consequence: "Output remains a MISMATCH, confirming that total information erasure cannot be reversed.",
    question: {
      prompt: "When does inference-time compute FAIL to recover memory?",
      options: [
        { text: "When conflicting updates completely overwrite and destroy the target coordinate norm.", correct: true, feedback: "Correct! If the signal eigenvalue is erased into the null space, no amount of deliberation can recover it." },
        { text: "Whenever sequence length is an even number.", correct: false, feedback: "Incorrect." },
        { text: "Inference scaling never fails.", correct: false, feedback: "Incorrect. The central claim is bounded and falsifiable." }
      ]
    }
  }
];

export default function GuidedPathwayLab() {
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const stage = STAGES[currentStageIdx];

  // Stage parameter states
  const [modelType, setModelType] = useState<string>(stage.modelType);
  const [seqLength, setSeqLength] = useState<number>(stage.defaultL);
  const [memoryCapacity, setMemoryCapacity] = useState<number>(stage.defaultM);
  const [interferenceStrength, setInterferenceStrength] = useState<number>(stage.defaultP);
  const [inferenceEffort, setInferenceEffort] = useState<number>(stage.defaultK);

  // Reflection questions answers
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [stageProgress, setStageProgress] = useState<boolean[]>(new Array(7).fill(false));

  // Final Synthesis Check State
  const [showSynthesis, setShowSynthesis] = useState<boolean>(false);
  const [synthesisAnswers, setSynthesisAnswers] = useState<{ [key: string]: number }>({});
  const [synthesisSubmitted, setSynthesisSubmitted] = useState<boolean>(false);

  // Sync state when stage changes
  const switchStage = (idx: number) => {
    const s = STAGES[idx];
    setCurrentStageIdx(idx);
    setModelType(s.modelType);
    setSeqLength(s.defaultL);
    setMemoryCapacity(s.defaultM);
    setInterferenceStrength(s.defaultP);
    setInferenceEffort(s.defaultK);
    setSelectedOption(null);
    setHasAnswered(false);
  };

  // Run simulation reactively
  const result: SimulationResult = ClientSimulator.runUnifiedLabExperiment(
    modelType,
    seqLength,
    memoryCapacity,
    interferenceStrength,
    inferenceEffort,
    42,
    false
  );

  const isMatch = result.metrics.is_correct;

  // Handle reflection question choice
  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    setHasAnswered(true);
    if (stage.question.options[idx].correct) {
      const updated = [...stageProgress];
      updated[currentStageIdx] = true;
      setStageProgress(updated);
    }
  };

  // Synthesis question choices
  const SYNTHESIS_QUESTIONS = [
    {
      id: "q1",
      prompt: "1. Why can a compact evolving state help with long sequences?",
      options: [
        { text: "It compresses history into a constant O(1) state, avoiding O(N) memory explosion.", correct: true },
        { text: "It stores every previous token in an uncompressed text file.", correct: false },
        { text: "It deletes the sequence and guesses randomly.", correct: false }
      ]
    },
    {
      id: "q2",
      prompt: "2. Why does interference occur in fixed-size states?",
      options: [
        { text: "Packing multiple key updates into a finite subspace causes overlapping dot-product cross-talk.", correct: true },
        { text: "The CPU frequency drops during matrix multiplication.", correct: false },
        { text: "Tokens are processed in alphabetical order.", correct: false }
      ]
    },
    {
      id: "q3",
      prompt: "3. What does additional inference computation change during retrieval?",
      options: [
        { text: "It iteratively relaxes the query along the state energy landscape to de-noise cross-talk.", correct: true },
        { text: "It permanently modifies the training weights.", correct: false },
        { text: "It retrains the model from scratch for each token.", correct: false }
      ]
    }
  ];

  const synthesisScore = Object.entries(synthesisAnswers).reduce((acc, [qId, optIdx]) => {
    const q = SYNTHESIS_QUESTIONS.find(q => q.id === qId);
    if (q && q.options[optIdx]?.correct) return acc + 1;
    return acc;
  }, 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* 7-Stage Stepper Header */}
      <div className="rounded-xl border border-white/10 bg-[#07090e] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
                Guided 7-Stage Memory Discovery Pathway
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Interactive 60-second guided stages to master long-horizon state dynamics and inference scaling.
            </p>
          </div>

          <button
            onClick={() => setShowSynthesis(!showSynthesis)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              showSynthesis
                ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                : "border-white/10 bg-white/5 text-slate-300 hover:text-white"
            }`}
          >
            <Trophy className="h-3.5 w-3.5 text-emerald-400" />
            {showSynthesis ? "Back to Stages" : "What Did You Learn?"}
          </button>
        </div>

        {/* 7-Step Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {STAGES.map((s, idx) => {
            const isCurrent = idx === currentStageIdx && !showSynthesis;
            const isDone = stageProgress[idx];
            return (
              <button
                key={s.id}
                onClick={() => {
                  setShowSynthesis(false);
                  switchStage(idx);
                }}
                className={`p-2 rounded-lg border text-left text-xs transition-all ${
                  isCurrent
                    ? "border-blue-500/60 bg-blue-500/20 text-white font-bold shadow-sm shadow-blue-900/30 ring-1 ring-blue-400"
                    : isDone
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15"
                    : "border-white/5 bg-black/40 text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
                  <span>STAGE {s.id}</span>
                  {isDone && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                </div>
                <div className="truncate text-[11px] font-medium">{s.name.split(". ")[1]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {!showSynthesis ? (
        /* Active Stage Card */
        <div className="space-y-6">
          
          {/* Objective & Explanation Card */}
          <div className="rounded-xl border border-blue-500/30 bg-[#07090e] p-6 space-y-4">
            
            {/* Stage Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-blue-400">
                  {stage.badge}
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Stage {stage.id}: {stage.name.split(". ")[1]}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded border border-white/10 shrink-0">
                Est. Time: 60 Seconds
              </span>
            </div>

            {/* 1. Learning Objective */}
            <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-xs text-blue-200 font-mono">
              <strong>Learning Objective: </strong> {stage.objective}
            </div>

            {/* 2. Short Explanation */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {stage.explanation}
            </p>

            {/* 3. Interactive Prompt */}
            <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-3.5 space-y-3">
              <div className="text-xs font-mono font-semibold text-purple-300 flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5" /> Stage Interaction: {stage.controlPrompt}
              </div>

              {/* Stage Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
                
                {/* Model Selector */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400">Architecture:</span>
                  <select
                    value={modelType}
                    onChange={(e) => setModelType(e.target.value)}
                    className="w-full rounded bg-black/60 border border-white/10 p-1.5 text-xs text-slate-200 font-mono"
                  >
                    <option value="educational_evolving_memory_toy">Educational Evolving Toy</option>
                    <option value="fixed_size_recurrent_memory">Fixed-Size Recurrent</option>
                    <option value="full_history_reference_baseline">Full-History Baseline</option>
                  </select>
                </div>

                {/* Sequence Length */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Seq Length (L):</span>
                    <span className="text-blue-400 font-bold">{seqLength}</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={250}
                    step={10}
                    value={seqLength}
                    onChange={(e) => setSeqLength(Number(e.target.value))}
                    className="w-full accent-blue-500 h-1.5 bg-white/10 rounded cursor-pointer"
                  />
                </div>

                {/* Interference Strength */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Interference (p):</span>
                    <span className="text-amber-400 font-bold">{(interferenceStrength * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.0}
                    max={0.8}
                    step={0.05}
                    value={interferenceStrength}
                    onChange={(e) => setInterferenceStrength(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-white/10 rounded cursor-pointer"
                  />
                </div>

                {/* Inference Effort */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Inference Effort (K):</span>
                    <span className="text-purple-400 font-bold">{inferenceEffort}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={16}
                    step={1}
                    value={inferenceEffort}
                    onChange={(e) => setInferenceEffort(Number(e.target.value))}
                    className="w-full accent-purple-500 h-1.5 bg-white/10 rounded cursor-pointer"
                  />
                </div>

              </div>
            </div>

            {/* 4. Observable Consequence Readout */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Observable Consequence:
              </div>

              {/* Side by Side Readout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/5 border border-white/5 p-3">
                  <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">EXPECTED GROUND TRUTH</div>
                  <div className="text-lg font-mono font-bold text-white">{result.expected_answer}</div>
                </div>
                <div
                  className={`rounded-lg border p-3 ${
                    isMatch
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-rose-500/40 bg-rose-500/10 text-rose-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase text-slate-300">MODEL OUTPUT</span>
                    <span className="text-[10px] font-mono font-bold">
                      {isMatch ? "MATCH (SUCCESS)" : "MISMATCH (CORRUPTED)"}
                    </span>
                  </div>
                  <div className="text-lg font-mono font-bold">{result.model_output}</div>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-300 bg-white/5 p-2.5 rounded border border-white/5">
                <strong>Result Takeaway: </strong> {stage.consequence} (Readout SNR: {result.metrics.snr_db.toFixed(1)} dB)
              </div>
            </div>

            {/* 5. Reflection Question */}
            <div className="rounded-xl border border-white/10 bg-[#04060a] p-5 space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white font-mono uppercase">
                  Stage {stage.id} Reflection Question:
                </h4>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-200">
                {stage.question.prompt}
              </p>

              {/* Question Options */}
              <div className="space-y-2">
                {stage.question.options.map((opt, oIdx) => {
                  const isSelected = selectedOption === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                        isSelected
                          ? opt.correct
                            ? "border-emerald-500 bg-emerald-500/20 text-emerald-200 font-semibold"
                            : "border-rose-500 bg-rose-500/20 text-rose-200"
                          : "border-white/5 bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-[11px] text-slate-400 shrink-0">
                          {String.fromCharCode(65 + oIdx)}.
                        </span>
                        <div>
                          <div>{opt.text}</div>
                          {isSelected && (
                            <div
                              className={`text-[11px] font-mono mt-1.5 pt-1.5 border-t ${
                                opt.correct
                                  ? "border-emerald-500/30 text-emerald-300"
                                  : "border-rose-500/30 text-rose-300"
                              }`}
                            >
                              {opt.feedback}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center border-t border-white/5 pt-4">
              <button
                onClick={() => switchStage(Math.max(0, currentStageIdx - 1))}
                disabled={currentStageIdx === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-mono text-slate-300 hover:text-white disabled:opacity-30"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Previous Stage
              </button>

              {currentStageIdx < STAGES.length - 1 ? (
                <button
                  onClick={() => switchStage(currentStageIdx + 1)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-mono font-medium text-white shadow-md shadow-blue-900/30"
                >
                  Next: Stage {currentStageIdx + 2} <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSynthesis(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-mono font-medium text-white shadow-md shadow-emerald-900/30"
                >
                  Complete &amp; Review Synthesis <Trophy className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

          </div>

          {/* D3 Visualizer for this Stage */}
          {stage.id === 5 ? (
            <InternalStateStepVisualizer traces={result.state_trace} modelType={result.model_type} />
          ) : stage.id === 4 ? (
            <div className="rounded-xl border border-white/10 bg-[#07090e] p-5 space-y-3">
              <div className="text-xs font-mono font-semibold text-white">Attractor Settling Visualization (K={inferenceEffort}):</div>
              <D3EnergyLandscape inferenceSteps={inferenceEffort} confidenceScore={isMatch ? 0.88 : 0.22} />
            </div>
          ) : (
            <StateVectorVisualizer traces={result.state_trace} modelType={result.model_type} />
          )}

        </div>
      ) : (
        /* "What Did You Learn?" Synthesis Section */
        <div className="rounded-xl border border-emerald-500/30 bg-[#07090e] p-6 space-y-6">
          
          <div className="space-y-2 border-b border-white/10 pb-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
              <Trophy className="h-3.5 w-3.5" /> Final Mastery Synthesis
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              What Did You Learn? Core Conceptual Synthesis
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Verify your mastery of the 3 fundamental pillars governing Long-Horizon Evolving States and Inference-Time Scaling.
            </p>
          </div>

          {/* 3 Synthesis Questions */}
          <div className="space-y-6">
            {SYNTHESIS_QUESTIONS.map((q) => {
              const selectedIdx = synthesisAnswers[q.id];
              return (
                <div key={q.id} className="rounded-xl border border-white/10 bg-black/40 p-5 space-y-3">
                  <h4 className="text-sm font-semibold text-white font-mono">{q.prompt}</h4>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedIdx === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            setSynthesisAnswers({ ...synthesisAnswers, [q.id]: optIdx });
                          }}
                          className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                            isChosen
                              ? synthesisSubmitted
                                ? opt.correct
                                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-200 font-bold"
                                  : "border-rose-500 bg-rose-500/20 text-rose-200"
                                : "border-blue-500 bg-blue-500/20 text-white font-medium"
                              : "border-white/5 bg-white/5 text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{opt.text}</span>
                            {synthesisSubmitted && isChosen && (
                              opt.correct ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 ml-2" />
                              ) : (
                                <XCircle className="h-4 w-4 text-rose-400 shrink-0 ml-2" />
                              )
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submission and Score Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-5">
            <button
              onClick={() => setSynthesisSubmitted(true)}
              disabled={Object.keys(synthesisAnswers).length < 3}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-mono font-medium text-white transition-all shadow-md shadow-emerald-900/30 disabled:opacity-40"
            >
              <Check className="h-4 w-4" /> Check Conceptual Understanding
            </button>

            {synthesisSubmitted && (
              <div className="flex items-center gap-3">
                <div className="text-xs font-mono text-slate-300">
                  Mastery Score: <span className="text-emerald-400 font-bold text-sm">{synthesisScore} / 3</span>
                </div>
                <span
                  className={`text-xs font-mono px-3 py-1 rounded-full border ${
                    synthesisScore === 3
                      ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                      : "border-amber-500/50 bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {synthesisScore === 3 ? "All Concepts Mastered! 🎉" : "Review Stage Takeaways"}
                </span>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
