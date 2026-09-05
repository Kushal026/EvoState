import React from "react";
import Link from "next/link";
import { ShieldAlert, BookOpen, ExternalLink, Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#04060a] text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-semibold text-white tracking-tight">DataForge: Evolving Memory Lab</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Pathway Track 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-lg">
              A scientific exploration environment dedicated to benchmarking the compression dynamics of 
              <span className="text-slate-200 font-medium"> Long-Horizon Evolving States</span> and the de-noising power of 
              <span className="text-slate-200 font-medium"> Inference-Time Scaling</span>.
            </p>
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] text-amber-300 max-w-lg">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <p>
                <strong>Educational Surrogate Notice:</strong> Client and toy models in this lab are isolated 
                micro-simulators. They are <em>never</em> marketed as official production BDH foundation model weights.
              </p>
            </div>
          </div>

          {/* Quick Deep Dives */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 font-mono">
              Theoretical Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/lab" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Terminal className="h-3 w-3 text-blue-400" /> Interactive EvoLab
                </Link>
              </li>
              <li>
                <Link href="/concept" className="hover:text-blue-400 transition-colors">
                  State Space & Superposition
                </Link>
              </li>
              <li>
                <Link href="/bdh" className="hover:text-blue-400 transition-colors">
                  Bi-Directional Dynamic Horizons
                </Link>
              </li>
              <li>
                <Link href="/bdh-cq" className="hover:text-blue-400 transition-colors">
                  Continuous Querying & Attractors
                </Link>
              </li>
            </ul>
          </div>

          {/* Evidence & Defense */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 font-mono">
              Scientific Evidence
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/research" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <BookOpen className="h-3 w-3" /> Literature (2022–2026)
                </Link>
              </li>
              <li>
                <Link href="/research#benchmarks" className="hover:text-blue-400 transition-colors">
                  Precomputed Benchmark Matrix
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  Judge Defense Sheet & FAQ
                </Link>
              </li>
              <li>
                <a
                  href="http://127.0.0.1:8000/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  FastAPI OpenAPI Specs <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-mono">
          <p>© 2026 DataForge Pathway Track. Educational & Research License.</p>
          <div className="flex items-center gap-4">
            <span>Deterministic Seed Standard (N=30)</span>
            <span>•</span>
            <span className="text-emerald-400">Zero Fabricated Numbers Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
