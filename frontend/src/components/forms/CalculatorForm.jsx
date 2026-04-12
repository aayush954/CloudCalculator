// components/forms/CalculatorForm.jsx
import React, { useState } from 'react';
import { Cpu, MemoryStick, HardDrive, Clock, MapPin, Zap, RotateCcw } from 'lucide-react';
import { Button, InputField } from '../ui';

const REGIONS = [
  { id: 'us-east',      label: '🇺🇸 US East (N. Virginia)' },
  { id: 'us-west',      label: '🇺🇸 US West (Oregon)' },
  { id: 'eu-west',      label: '🇪🇺 Europe West (Ireland)' },
  { id: 'eu-central',   label: '🇩🇪 Europe Central (Frankfurt)' },
  { id: 'ap-southeast', label: '🇸🇬 Asia Pacific SE (Singapore)' },
  { id: 'ap-northeast', label: '🇯🇵 Asia Pacific NE (Tokyo)' },
  { id: 'ap-south',     label: '🇮🇳 Asia South (Mumbai)' },
  { id: 'sa-east',      label: '🇧🇷 South America (São Paulo)' },
];

const PRESETS = [
  { label: 'Starter',    cpu: 2,  ram: 4,   storage: 50,   hours: 730,  icon: '🌱' },
  { label: 'Web App',    cpu: 4,  ram: 16,  storage: 200,  hours: 730,  icon: '🌐' },
  { label: 'API Server', cpu: 8,  ram: 32,  storage: 100,  hours: 730,  icon: '⚡' },
  { label: 'Data Node',  cpu: 16, ram: 64,  storage: 1000, hours: 730,  icon: '🗄️' },
  { label: 'Dev/Test',   cpu: 2,  ram: 8,   storage: 50,   hours: 160,  icon: '🔧' },
];

const defaultValues = { cpu: 4, ram: 16, storage: 100, hours: 730, region: 'us-east' };

const CalculatorForm = ({ onCalculate, loading }) => {
  const [form,   setForm]   = useState(defaultValues);
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => {
    const v = e.target.value;
    setForm((p) => ({ ...p, [field]: field === 'region' ? v : Number(v) }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.cpu     || form.cpu < 1     || form.cpu > 256)   e.cpu     = 'Must be 1–256 cores';
    if (!form.ram     || form.ram < 1     || form.ram > 2048)  e.ram     = 'Must be 1–2048 GB';
    if (!form.storage || form.storage < 1 || form.storage > 65536) e.storage = 'Must be 1–65536 GB';
    if (!form.hours   || form.hours < 1   || form.hours > 744) e.hours   = 'Must be 1–744 hrs/month';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    onCalculate(form);
  };

  const applyPreset = (preset) => {
    setErrors({});
    setForm((p) => ({ ...p, ...preset }));
  };

  const reset = () => { setForm(defaultValues); setErrors({}); };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Presets */}
      <div>
        <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Quick Presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/40 text-white/60 hover:text-white text-xs font-medium transition-all duration-200"
            >
              <span>{preset.icon}</span>
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* CPU & RAM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <InputField
            label="CPU Cores"
            value={form.cpu}
            onChange={update('cpu')}
            min={1} max={256} step={1}
            unit="vCPU"
            icon={Cpu}
            error={errors.cpu}
            hint="Virtual CPUs allocated"
          />
          <input
            type="range" min={1} max={64} value={Math.min(form.cpu, 64)} step={1}
            onChange={update('cpu')}
            className="mt-2 w-full"
          />
          <div className="flex justify-between text-white/20 text-xs mt-1">
            <span>1</span><span>16</span><span>32</span><span>64+</span>
          </div>
        </div>

        <div>
          <InputField
            label="RAM"
            value={form.ram}
            onChange={update('ram')}
            min={1} max={2048} step={1}
            unit="GB"
            icon={MemoryStick}
            error={errors.ram}
            hint="Memory allocated"
          />
          <input
            type="range" min={1} max={256} value={Math.min(form.ram, 256)} step={1}
            onChange={update('ram')}
            className="mt-2 w-full"
          />
          <div className="flex justify-between text-white/20 text-xs mt-1">
            <span>1</span><span>64</span><span>128</span><span>256+</span>
          </div>
        </div>
      </div>

      {/* Storage & Hours */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <InputField
            label="Storage"
            value={form.storage}
            onChange={update('storage')}
            min={1} max={65536} step={1}
            unit="GB"
            icon={HardDrive}
            error={errors.storage}
            hint="SSD block storage"
          />
          <input
            type="range" min={1} max={2000} value={Math.min(form.storage, 2000)} step={10}
            onChange={update('storage')}
            className="mt-2 w-full"
          />
          <div className="flex justify-between text-white/20 text-xs mt-1">
            <span>1</span><span>500</span><span>1000</span><span>2000+</span>
          </div>
        </div>

        <div>
          <InputField
            label="Monthly Usage"
            value={form.hours}
            onChange={update('hours')}
            min={1} max={744} step={1}
            unit="hrs"
            icon={Clock}
            error={errors.hours}
            hint="730 = 24/7 full month"
          />
          <input
            type="range" min={1} max={730} value={form.hours} step={1}
            onChange={update('hours')}
            className="mt-2 w-full"
          />
          <div className="flex justify-between text-white/20 text-xs mt-1">
            <span>1h</span><span>8h/d</span><span>12h/d</span><span>24/7</span>
          </div>
        </div>
      </div>

      {/* Region */}
      <div>
        <label className="flex items-center gap-2 text-white/70 text-sm font-medium mb-1.5">
          <MapPin size={14} className="text-violet-400" />
          Region
        </label>
        <select
          value={form.region}
          onChange={update('region')}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 hover:border-white/20 transition-all duration-200 cursor-pointer"
        >
          {REGIONS.map((r) => (
            <option key={r.id} value={r.id} className="bg-gray-900 text-white">
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Button
          type="submit"
          loading={loading}
          fullWidth
          size="lg"
          className="shadow-xl shadow-violet-500/20"
        >
          <Zap size={18} />
          {loading ? 'Calculating...' : 'Compare Cloud Costs'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={reset}
          size="lg"
          className="flex-shrink-0"
        >
          <RotateCcw size={16} />
        </Button>
      </div>
    </form>
  );
};

export default CalculatorForm;
