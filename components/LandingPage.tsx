import React from 'react';
import { Layers, Zap, Shield, Network, ArrowRight, Activity, Cpu, Brain, Database, GitBranch } from 'lucide-react';
import LottieAvatar from './LottieAvatar';

interface LandingPageProps {
  onLaunchApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  return (
    <div className="h-screen bg-[#050505] text-gray-200 font-sans overflow-y-auto overflow-x-hidden">
      {/* Animated Background - teal and purple glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-walrus-teal/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-walrus-purple/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-walrus-teal/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        {/* Header - matches WalletBar */}
        <header className="h-12 bg-black/80 backdrop-blur-md border-b border-white/10 flex items-center px-6 justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <h1 className="font-bold font-heading tracking-tight flex items-center gap-2 text-lg">
              <Layers size={18} className="text-walrus-purple" /> 
              <span className="bg-gradient-to-l from-walrus-teal to-walrus-purple bg-clip-text text-transparent">WALRUS AGENTS</span>
              <span className="text-white/40 text-xs font-normal font-mono">v1.0</span>
            </h1>
          </div>
          <button
            onClick={onLaunchApp}
            className="px-5 py-2 bg-gradient-to-r from-walrus-teal to-walrus-purple hover:from-walrus-teal/90 hover:to-walrus-purple/90 rounded border-0 transition-all duration-300 flex items-center gap-2 text-black text-sm font-display font-bold tracking-tight shadow-lg hover:shadow-walrus-purple/50"
          >
            Launch App <ArrowRight size={16} />
          </button>
        </header>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 my-20 px-6 max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="flex-1 space-y-6">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-walrus-teal/10 to-walrus-purple/10 rounded-lg border border-walrus-purple/30 backdrop-blur-sm">
              <span className="text-xs font-mono uppercase tracking-wider text-walrus-purple">
                🏆 Walrus Haulout Hackathon | AI x Data Track
              </span>
            </div>

            <h2 className="text-5xl lg:text-7xl font-bold leading-tight font-heading">
              <span className="bg-gradient-to-l from-walrus-teal via-walrus-purple to-walrus-teal bg-clip-text text-transparent">Tokenized</span>
              <br />
              <span className="text-white/90">AI Agents</span>
              <br />
              <span className="text-white/60">on Walrus</span>
            </h2>

            <p className="text-base text-gray-400 max-w-2xl leading-relaxed">
              <span className="text-walrus-purple font-semibold">Tokenized AI agents</span> minted as NFTs coordinate decentralized training of <span className="text-walrus-purple font-semibold">neural networks</span> directly in your browser. 
              Each agent is an <span className="text-walrus-teal font-semibold">on-chain asset</span> with model updates stored on Walrus Protocol and verified through <span className="text-green-400 font-semibold">SEAL attestations</span>. 
              Users contribute compute, <span className="text-walrus-purple font-semibold">earn rewards</span>, and trade agents—while <span className="text-walrus-purple font-semibold">Sui smart contracts</span> manage coordination, verification, and incentives. 
              Fully <span className="text-walrus-teal font-semibold">decentralized AI</span> with no centralized servers required.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={onLaunchApp}
                className="px-6 py-3 bg-gradient-to-r from-walrus-teal to-walrus-purple text-black rounded font-bold text-sm font-mono uppercase tracking-wider hover:shadow-[0_0_20px_rgba(207,176,255,0.5)] transition-all duration-300 flex items-center gap-2"
              >
                <Zap size={16} /> Launch App
              </button>
              <a
                href="https://github.com/johnnyduo/WalrusAgent"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded font-bold text-sm font-mono uppercase tracking-wider backdrop-blur-sm border border-white/10 hover:border-walrus-purple/50 transition-all duration-300"
              >
                View on GitHub
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-6 font-mono">
              <div>
                <div className="text-2xl font-bold text-walrus-teal">41</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Parameters</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-walrus-teal">3-6s</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Training</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-walrus-teal">10</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Epochs</div>
              </div>
            </div>
          </div>

          {/* Right - Walrus GIF */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-walrus-teal/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative bg-black/40 rounded-xl p-8 backdrop-blur-sm border border-walrus-teal/20">
                <img 
                  src="https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUyaXF2MDBoMzdvajVvOG13M3ljYzkyenNveTY4ZXBlZG05a2c3cTdtcCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/XCPnjIUMT06ek/giphy.gif"
                  alt="Walrus"
                  width={350}
                  height={350}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20 px-6 max-w-7xl mx-auto">
          <FeatureCard
            icon={<Brain className="text-walrus-teal" size={24} />}
            title="Real ML Training"
            description="41-parameter neural network with backpropagation"
          />
          <FeatureCard
            icon={<Shield className="text-walrus-teal" size={24} />}
            title="Seal Certification"
            description="Cryptographic proof on every Walrus upload"
          />
          <FeatureCard
            icon={<Database className="text-walrus-teal" size={24} />}
            title="10-Epoch Storage"
            description="Permanent model weights on Walrus Protocol"
          />
          <FeatureCard
            icon={<GitBranch className="text-walrus-teal" size={24} />}
            title="Federated Learning"
            description="Aggregate gradients from multiple contributors"
          />
        </div>

        {/* Agent Showcase */}
        <div className="text-center mb-8 px-6 max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold mb-2 font-mono text-walrus-teal uppercase tracking-wider">Training Pipeline</h3>
          <p className="text-gray-500 text-sm font-mono uppercase tracking-wider">7 Specialized AI Agents for Distributed Training</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-6 mb-20 max-w-7xl mx-auto">
          <AgentPreview 
            name="Walrus Commander" 
            role="Coordinator" 
            avatar="https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUyaXF2MDBoMzdvajVvOG13M3ljYzkyenNveTY4ZXBlZG05a2c3cTdtcCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/XCPnjIUMT06ek/giphy.gif"
            ability="Distributed training coordination & epoch management across the network"
          />
          <AgentPreview 
            name="Flying Fish Scout" 
            role="Preprocessor" 
            avatar="https://storage.gra.cloud.ovh.net/v1/AUTH_728ab22ba0c842468a897907be9a7075/flipanim/anim/njjpf2to.gif"
            ability="Data preprocessing & feature engineering for optimal model input"
          />
          <AgentPreview 
            name="Octopus Architect" 
            role="Architect" 
            avatar="/octopus.gif"
            ability="Model architecture design & hyperparameter optimization"
          />
          <AgentPreview 
            name="Dolphin Trainer" 
            role="Trainer" 
            avatar="/dolphin.gif"
            ability="Gradient computation & backpropagation with TensorFlow.js"
          />
          <AgentPreview 
            name="Sea Turtle Guardian" 
            role="Validator" 
            avatar="/sea-turtle.gif"
            ability="Model validation & quality assurance with accuracy thresholds"
          />
          <AgentPreview 
            name="Jellyfish Mystic" 
            role="Optimizer" 
            avatar="/jellyfish.gif"
            ability="Inference optimization & model quantization for deployment"
          />
          <AgentPreview 
            name="Manta Ray Messenger" 
            role="Aggregator" 
            avatar="/manta-ray.gif"
            ability="Federated aggregation & consensus of gradient updates"
          />
        </div>

        {/* Footer CTA */}
        <div className="my-16 text-center px-6 pb-20 max-w-7xl mx-auto">
          <div className="inline-block p-8 bg-black/40 rounded-xl backdrop-blur-sm border border-walrus-teal/20">
            <h3 className="text-2xl font-bold mb-3 font-mono text-walrus-teal uppercase tracking-wider">Start Training Now</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto font-mono text-sm">
              Train real neural networks in your browser. Store on Walrus. Verify on Sui.
            </p>
            <button
              onClick={onLaunchApp}
              className="px-8 py-3 bg-walrus-teal text-black rounded font-bold text-sm font-mono uppercase tracking-wider hover:shadow-[0_0_20px_rgba(153,239,228,0.5)] transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Brain size={16} /> Launch Training Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => {
  return (
    <div className="p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 hover:border-walrus-teal/50 transition-all duration-300">
      <div className="mb-3">{icon}</div>
      <h4 className="text-sm font-bold mb-1 font-mono uppercase tracking-wider text-white/90">{title}</h4>
      <p className="text-xs text-gray-500 font-mono">{description}</p>
    </div>
  );
};

const AgentPreview: React.FC<{ 
  name: string; 
  role: string; 
  avatar: string;
  ability: string;
}> = ({ name, role, avatar, ability }) => {
  return (
    <div className="p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 hover:border-walrus-teal/50 transition-all duration-300 group cursor-pointer">
      <div className="flex items-start gap-3 mb-3">
        <div className="relative flex-shrink-0">
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-walrus-teal animate-pulse"></div>
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10">
            <LottieAvatar 
              animationPath={avatar}
              width={64}
              height={64}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm font-mono text-white/90 mb-0.5">{name}</div>
          <div className="text-[10px] text-walrus-teal font-mono uppercase tracking-wider">{role}</div>
        </div>
      </div>
      <p className="text-xs text-gray-400 font-mono leading-relaxed">{ability}</p>
    </div>
  );
};

export default LandingPage;
