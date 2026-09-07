"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Database, 
  ArrowRight, 
  Activity, 
  Sparkles, 
  Scale, 
  BookOpen, 
  Zap, 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  Compass, 
  ExternalLink,
  Sliders
} from "lucide-react";
import HeroStreamVisualizer from "@/components/HeroStreamVisualizer";
import BreakTheMemory from "@/components/BreakTheMemory";
import ChallengeTheClaim from "@/components/ChallengeTheClaim";
import EvidenceBadge from "@/components/EvidenceBadge";
import SixtySecondExperiment from "@/components/SixtySecondExperiment";

export default function HomePage() {
  const [activeClaimStage, setActiveClaimStage] = useState<number>(0);

  const CLAIM_STAGES = [
    {
      id: "remember",
      number: "01",
      title: "REMEMBER",
      tagline: "Compact state carries information.",
      desc: "A constant-sized state vector or matrix can accurately preserve associative key-value bindings over short and medium horizons without storing a full KV cache.",
      badgeText: "Linear Footprint",
      badgeColor: "text-slate-300 border-white/10 bg-white/5",
      labHref: "/lab?mode=sixty_sec&step=0"
    },
    {
      id: "stretch",
      number: "02",
      title: "STRETCH",
      tagline: "Longer sequences create pressure.",
      desc: "As the sequence horizon dilates (T > 256 tokens), recurrent state dynamics suffer exponential recency attenuation and finite-capacity subspace saturation.",
      badgeText: "Horizon Scaling",
      badgeColor: "text-slate-300 border-white/10 bg-white/5",
      labHref: "/lab?mode=sixty_sec&step=1"
    },
    {
      id: "attack",
      number: "03",
      title: "ATTACK",
      tagline: "Conflicting updates create interference.",
      desc: "When subsequent tokens overwrite similar subspace coordinates, destructive interference occurs, degrading previous associative retrieval.",
      badgeText: "Superposition Limit",
      badgeColor: "text-slate-300 border-white/10 bg-white/5",
      labHref: "/lab?mode=sixty_sec&step=2"
    },
    {
      id: "recover",
      number: "04",
      title: "RECOVER",
      tagline: "Additional inference may improve recovery.",
      desc: "By allocating recurrent latent reasoning cycles (C_infer) at test-time, the model can relax noisy superposition states into clean attractor basins.",
      badgeText: "Test-Time Compute",
      badgeColor: "text-slate-300 border-white/10 bg-white/5",
      labHref: "/lab?mode=sixty_sec&step=3"
    }
  ];

  return (
    <div className="space-y-16 lg:space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="space-y-8 pt-4">
        
        {/* Eyebrow & Main Headings */}
        <div className="space-y-5 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Can a small <span className="text-blue-400">evolving state</span> <br />
            remember?
          </h1>
          
          <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-light">
            EvoState is an interactive computational laboratory for exploring 
            <strong className="text-white font-medium"> long-horizon memory</strong>, 
            <strong className="text-white font-medium"> associative interference</strong>, and 
            <strong className="text-white font-medium"> inference-time compute scaling</strong>.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/lab"
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Terminal className="h-4 w-4" />
              <span>Run the experiment →</span>
            </Link>

            <Link
              href="/concept"
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 px-5 py-3.5 text-sm font-medium text-slate-200 transition-all"
            >
              <BookOpen className="h-4 w-4 text-slate-400" />
              <span>Understand the idea</span>
            </Link>

            <Link
              href="/about"
              className="flex items-center gap-1.5 rounded-xl border border-transparent hover:border-white/10 px-4 py-3.5 text-xs font-mono text-slate-400 hover:text-white transition-all"
            >
              <span>Judge Defense Sheet</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Hero Interactive Visualization: Live Stream -> Evolving State -> Recall */}
        <div>
          <HeroStreamVisualizer />
        </div>

      </section>


      {/* 2. THE CENTRAL FALSIFIABLE CLAIM (4-STAGE INTERACTIVE PIPELINE) */}
      <section className="space-y-6 pt-4 border-t border-white/10">
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-400">
              The Scientific Claim
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How Memory Evolves Under Pressure
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            We dissect the central falsifiable claim across four critical stages of the memory lifecycle:
          </p>
        </div>

        {/* 4 Interactive Claim Stages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CLAIM_STAGES.map((stage, idx) => {
            const isActive = activeClaimStage === idx;
            return (
              <div
                key={stage.id}
                onClick={() => setActiveClaimStage(idx)}
                className={`cursor-pointer rounded-xl border p-5 flex flex-col justify-between transition-all ${
                  isActive
                    ? "border-blue-500 bg-blue-950/30 shadow-lg shadow-blue-500/10 scale-[1.02]"
                    : "border-white/10 bg-[#080c14] hover:border-white/20 hover:bg-[#0c121e]"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      STAGE {stage.number}
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase ${stage.badgeColor}`}>
                      {stage.badgeText}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">
                    {stage.title}
                  </h3>

                  <p className="text-xs font-medium text-slate-200 leading-snug">
                    {stage.tagline}
                  </p>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-blue-400 font-semibold">
                    Explore in Lab
                  </span>
                  <Link
                    href={stage.labHref}
                    className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </section>


      {/* 3. CENTERPIECE: BREAK THE MEMORY */}
      <section id="break-the-memory" className="space-y-4 pt-4 border-t border-white/10">
        <BreakTheMemory />
      </section>


      {/* 4. FAST JUDGE RUN (60-SECOND RAPID AUDIT) */}
      <section className="space-y-4 pt-4 border-t border-white/10">
        <SixtySecondExperiment />
      </section>


      {/* 5. CHALLENGE THE CLAIM */}
      <section className="space-y-4 pt-4 border-t border-white/10">
        <ChallengeTheClaim />
      </section>


      {/* 6. HOW IT WORKS: ARCHITECTURAL FOUNDATIONS */}
      <section className="space-y-6 pt-4 border-t border-white/10">
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-400">
              Architectural Foundations
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How Sequence Memory Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Understanding the transition from uncompressed quadratic history to evolving associative states.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Architecture 1: Full History */}
          <div className="rounded-xl border border-white/10 bg-[#07090e] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">01 &bull; Baseline</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                O(T) Space
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Full-History Attention (KV Cache)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard Transformers store every previous token embedding. Perfect recall across arbitrary context, but suffers quadratic compute scaling and explosive GPU memory usage during generation.
            </p>
            <div className="rounded bg-black/40 p-2 font-mono text-[10px] text-slate-300 border border-white/5">
              Memory: M_KV = 2 &middot; T &middot; d &middot; b bytes
            </div>
          </div>

          {/* Architecture 2: Fixed Recurrent */}
          <div className="rounded-xl border border-white/10 bg-[#07090e] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">02 &bull; Recurrent</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                O(1) Space
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Fixed-Size Recurrent State (RNN/GRU)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compresses all history into a static vector <code>h_t &isin; &reals;^d</code> via non-linear updates. Constant-time inference, but suffers exponential gradient vanishing and rapid recency degradation.
            </p>
            <div className="rounded bg-black/40 p-2 font-mono text-[10px] text-slate-300 border border-white/5">
              State: h_t = tanh(W_h h_&#123;t-1&#125; + W_x x_t)
            </div>
          </div>

          {/* Architecture 3: Evolving State */}
          <div className="rounded-xl border border-blue-500/30 bg-[#080c16] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-blue-400 font-semibold">03 &bull; EvoState</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                O(1) Space + Scaling
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Evolving Associative Fast-Weights</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maintains an associative matrix state with local outer-product binding. Leverages test-time recurrent latent reasoning to denoise superposition crosstalk and recover degraded memories.
            </p>
            <div className="rounded bg-black/40 p-2 font-mono text-[10px] text-blue-300 border border-blue-500/20">
              Update: M_t = &lambda; M_&#123;t-1&#125; + (v_t &otimes; k_t^T)
            </div>
          </div>

        </div>

      </section>


      {/* 7. BDH RESEARCH CONNECTION */}
      <section className="rounded-2xl border border-white/10 bg-[#07090e] p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-blue-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Primary Academic Connection &amp; Literature Review
            </span>
          </div>
          <EvidenceBadge tier="published" label="Published Research" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              BDH: The Dragon Hatchling (Kosowski et al., 2025)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              In <strong className="text-white">arXiv:2509.26507</strong>, Kosowski et al. present the Dragon Hatchling (BDH) architecture as a biologically plausible sequence model connecting Transformers to evolving internal states and brain-inspired local plasticity.
            </p>
            
            {/* Scientific Boundary Notice */}
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs text-slate-300 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <strong className="text-white">Scientific Attribution Standard:</strong> EvoState models are isolated educational surrogates designed to explore associative memory dynamics. They are <em>never</em> presented as official BDH foundation model weights.
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-2.5">
            <Link
              href="/bdh"
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-3 text-xs font-mono text-slate-200 transition-all"
            >
              <span>Explore BDH Breakdown</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/bdh-cq"
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-3 text-xs font-mono text-slate-200 transition-all"
            >
              <span>Inspect BDH-CQ Scaling</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </section>


      {/* 8. RESEARCH OBSERVATORY (2,700 TRIALS SUMMARY) */}
      <section className="space-y-6 pt-4 border-t border-white/10">
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-400">
                Empirical Research Matrix
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              2,700 Controlled Experimental Trials
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Verified benchmark sweeps evaluated across 4 sequence models with 95% confidence intervals.
            </p>
          </div>

          <Link
            href="/research"
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-mono text-slate-200 transition-all"
          >
            <span>View Full Dataset &amp; Plots</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 4 Research Snapshot Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          
          <div className="rounded-xl border border-white/10 bg-[#07090e] p-4 space-y-1.5">
            <div className="text-[10px] text-slate-400 uppercase">1. Sequence Horizon</div>
            <div className="text-base font-bold text-white">T &isin; [16, 1024]</div>
            <p className="text-[11px] text-slate-400 font-sans">
              Measures memory degradation as sequence length dilates by 64&times;.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#07090e] p-4 space-y-1.5">
            <div className="text-[10px] text-slate-400 uppercase">2. Capacity Saturation</div>
            <div className="text-base font-bold text-white">N_pairs &isin; [1, 32]</div>
            <p className="text-[11px] text-slate-400 font-sans">
              Empirical verification of the Johnson-Lindenstrauss associative bound.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#07090e] p-4 space-y-1.5">
            <div className="text-[10px] text-slate-400 uppercase">3. Overwrite Attack</div>
            <div className="text-base font-bold text-white">N_overwrites &isin; [1, 10]</div>
            <p className="text-[11px] text-slate-400 font-sans">
              Destructive interference when conflicting tokens crowd similar subspace coordinates.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#07090e] p-4 space-y-1.5">
            <div className="text-[10px] text-slate-400 uppercase">4. Inference Scaling</div>
            <div className="text-base font-bold text-white">C_infer &isin; [1, 25]</div>
            <p className="text-[11px] text-slate-400 font-sans">
              Test-time compute Pareto trade-offs: latency overhead vs denoised SNR.
            </p>
          </div>

        </div>

      </section>


      {/* 9. SCIENTIFIC LIMITATIONS & HONESTY */}
      <section className="rounded-xl border border-white/10 bg-[#07090e] p-6 space-y-4">
        
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
          <ShieldAlert className="h-4 w-4 text-slate-400" />
          Scientific Boundaries &amp; Limitations
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400 leading-relaxed">
          <div className="space-y-1">
            <div className="font-semibold text-slate-200">Finite Dimension Bottleneck</div>
            <p>An evolving state cannot overcome linear algebra: when the number of orthogonal keys exceeds state dimension d, information loss is mathematically guaranteed.</p>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-slate-200">Inference Compute Limits</div>
            <p>Additional test-time cycles cannot recover signals that have been completely overwritten into the matrix null space.</p>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-slate-200">Toy Surrogate Scope</div>
            <p>The client simulation is an educational d=32 tool for conceptual intuition, accompanied by 2,700 offline PyTorch benchmark runs.</p>
          </div>
        </div>

      </section>


      {/* 10. LAUNCH LAB CTA BANNER */}
      <section className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 p-8 sm:p-12 text-center space-y-5">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ready to experiment?
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Launch the interactive memory laboratory to step through guided discovery, test adversarial interference, or scale inference compute in real time.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/lab"
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Terminal className="h-4 w-4" />
            <span>Launch Interactive Lab →</span>
          </Link>
          <Link
            href="/compare"
            className="rounded-xl border border-white/20 hover:bg-white/10 px-6 py-3.5 text-sm font-medium text-slate-200 transition-all"
          >
            Compare 5 Architectures
          </Link>
        </div>
      </section>

    </div>
  );
}
