import { motion } from 'framer-motion';
import { Cpu, Workflow, Network, CheckCircle, GitBranch, Layers, Activity } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';

export default function AiEngineeringSection() {
  const pillars = [
    {
      title: 'Physics-Informed Neural Networks (PINNs)',
      description:
        'Embedding Navier-Stokes fluid equations and elastodynamic partial differential equations into deep neural loss functions to ensure zero unphysical predictions across complex fluid-structure interaction regimes.',
      icon: Layers,
      badge: 'PINN FORMULATION',
      stats: 'Governed by Physical PDEs',
      mathLabel: 'Loss = MSE_data + λ·MSE_pde',
    },
    {
      title: 'Surrogate Modeling for High-Order FEA & CFD',
      description:
        'Training Gaussian process regressors and deep autoencoders on high-fidelity simulation ensembles to accelerate non-linear multi-hour thermal and stress solver runs to sub-second computational approximations.',
      icon: Cpu,
      badge: 'SURROGATE INFERENCE',
      stats: 'Accelerated Parametric Sweeps',
      mathLabel: 'x* → f_surrogate(x*) ~ f_fea(x*)',
    },
    {
      title: 'Generative Topology & Latent Exploration',
      description:
        'Synthesizing lightweight structural geometry conditioned on von Mises stress thresholds, manufacturing tooling constraints, and additive manufacturing overhang angles for mass optimization.',
      icon: Network,
      badge: 'GENERATIVE TOPOLOGY',
      stats: 'Tooling & Stress Aware',
      mathLabel: 'min Mass s.t. σ_max ≤ σ_yield',
    },
    {
      title: 'Mechatronic Vibration & Predictive Maintenance',
      description:
        'Decomposing real-time accelerometer and acoustic telemetry via 1D-CNN architectures to detect early bearing fatigue, gear tooth pitting, and motor stator harmonics before catastrophic mechanical failure.',
      icon: Workflow,
      badge: 'CONDITION MONITORING',
      stats: 'Edge Vibration Telemetry',
      mathLabel: 'FFT Spectrum → 1D-CNN Wear Classifier',
    },
  ];

  return (
    <section id="ai-engineering" className="section-padding relative overflow-hidden">
      {/* Purposeful Background: Computational Engineering Data Flow Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 70% 30%, rgba(0, 212, 255, 0.08) 0%, transparent 45%),
              radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.06) 0%, transparent 45%),
              linear-gradient(rgba(0, 212, 255, 0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.035) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
          }}
        />
        {/* Subtle computational data path */}
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[rgba(0,212,255,0.2)] to-transparent" />
        <div className="absolute right-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[rgba(59,130,246,0.15)] to-transparent" />
      </div>

      <div className="section-container relative z-10">
        <SectionHeader
          label="COMPUTATIONAL INTELLIGENCE"
          title="AI × Mechanical Engineering"
          description="Merging classical Newtonian mechanics and computational continuum solvers with physics-informed machine learning and rapid surrogate inference."
          badge="FRONTIER"
        />

        {/* Computational Telemetry Bar */}
        <div className="mb-8 p-3 rounded-xl bg-[rgba(10,12,18,0.7)] border border-[rgba(0,212,255,0.2)] flex flex-wrap items-center justify-between gap-4 text-[0.68rem] font-mono text-[var(--color-silver)] backdrop-blur-md">
          <div className="flex items-center gap-2 text-[var(--color-cyan)]">
            <GitBranch className="w-3.5 h-3.5" />
            <span>SOLVER PIPELINE: PINN ENSEMBLE // TENSORFLOW &bull; PYTORCH &bull; ANSYS</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-gunmetal)]">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>SURROGATE CONVERGENCE: LOSS &lt; 10⁻⁵</span>
          </div>
        </div>

        {/* Technical Architecture Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {pillars.map((pillar, index) => {
            const IconComp = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="eng-card p-6 md:p-8 flex flex-col justify-between hover:border-[rgba(0,212,255,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(0,212,255,0.08)] transition-all duration-300 group relative overflow-hidden"
              >
                {/* Top glow trace */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-cyan)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center text-[var(--color-cyan)] group-hover:scale-105 transition-transform">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-[0.68rem] font-mono text-[var(--color-cyan)] font-semibold tracking-wider">
                        {pillar.badge}
                      </span>
                    </div>
                    <span className="text-[0.62rem] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      ACTIVE MODEL
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-display text-[var(--color-pure-white)] group-hover:text-[var(--color-cyan)] transition-colors mb-2.5">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-[var(--color-silver)] leading-relaxed mb-4">
                    {pillar.description}
                  </p>

                  {/* Math Formulation / Scientific Formula Callout */}
                  <div className="p-2.5 rounded bg-[rgba(0,212,255,0.04)] border border-[rgba(0,212,255,0.15)] text-[0.68rem] font-mono text-[var(--color-cyan-dim)] mb-4">
                    <span className="text-[var(--color-gunmetal)] mr-2">// FORMULATION:</span>
                    <span className="text-[var(--color-platinum)] font-semibold">{pillar.mathLabel}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                  <span className="text-[0.65rem] font-mono text-[var(--color-platinum)]">
                    METRIC // {pillar.stats}
                  </span>
                  <span className="text-[0.6rem] font-mono text-[var(--color-cyan)] font-semibold">
                    PHYSICS-CONSTRAINED
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
