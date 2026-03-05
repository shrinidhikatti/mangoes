import { useState, useEffect } from 'react';
import { Save, MapPin, Truck, Clock, Phone, Store, Plus, X, Check } from 'lucide-react';
import { getConfig, updateConfig } from '../../services/dataService';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './SettingsPage.css';

export default function SettingsPage() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newPincode, setNewPincode] = useState('');

  useEffect(() => {
    async function loadConfig() {
      try {
        const cfg = await getConfig();
        setConfig(cfg);
      } catch (err) {
        console.error('Failed to load config:', err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  if (loading || !config) return <LoadingSpinner size="lg" text="Loading settings..." />;

  const updateField = (path, value) => {
    setConfig(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const addPincode = () => {
    if (newPincode.length === 6 && !config.serviceablePincodes.includes(newPincode)) {
      setConfig(prev => ({
        ...prev,
        serviceablePincodes: [...prev.serviceablePincodes, newPincode]
      }));
      setNewPincode('');
    }
  };

  const removePincode = (pin) => {
    setConfig(prev => ({
      ...prev,
      serviceablePincodes: prev.serviceablePincodes.filter(p => p !== pin)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateConfig(config);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-settings">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Configure your store settings</p>
        </div>
        <Button
          icon={saved ? <Check size={16} /> : <Save size={16} />}
          onClick={handleSave}
          loading={saving}
          className={saved ? 'btn--added' : ''}
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <div className="settings-grid">
        {/* Store Status */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Store size={20} /><h3>Store Status</h3>
          </div>
          <div className="settings-card-body">
            <div className="toggle-field">
              <div>
                <strong>Store Open</strong>
                <p>When closed, customers see the closed message</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={config.isStoreOpen} onChange={e => updateField('isStoreOpen', e.target.checked)} />
                <span className="switch-slider" />
              </label>
            </div>
            {!config.isStoreOpen && (
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Closed Message</label>
                <textarea value={config.storeClosedMessage} onChange={e => updateField('storeClosedMessage', e.target.value)} rows={2} />
              </div>
            )}
          </div>
        </div>

        {/* Delivery Charges */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Truck size={20} /><h3>Delivery Charges</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-row">
              <div className="form-group">
                <label>Free delivery above (₹)</label>
                <input type="number" value={config.deliveryCharges.freeAbove} onChange={e => updateField('deliveryCharges.freeAbove', Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label>Flat delivery charge (₹)</label>
                <input type="number" value={config.deliveryCharges.flatRate} onChange={e => updateField('deliveryCharges.flatRate', Number(e.target.value))} />
              </div>
            </div>
            <div className="form-group">
              <label>Minimum order value (₹)</label>
              <input type="number" value={config.minimumOrderValue} onChange={e => updateField('minimumOrderValue', Number(e.target.value))} />
            </div>
          </div>
        </div>

        {/* Order Cutoff */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Clock size={20} /><h3>Order Cutoff</h3>
          </div>
          <div className="settings-card-body">
            <div className="form-group">
              <label>Cutoff Time</label>
              <input type="time" value={config.orderCutoffTime} onChange={e => updateField('orderCutoffTime', e.target.value)} />
            </div>
            <p className="settings-hint">
              Orders before {config.orderCutoffTime} get next-day delivery. Orders after get delivery in 2 days.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Phone size={20} /><h3>Contact Information</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" value={config.contactPhone} onChange={e => updateField('contactPhone', e.target.value)} />
              </div>
              <div className="form-group">
                <label>WhatsApp Number</label>
                <input type="tel" value={config.contactWhatsApp} onChange={e => updateField('contactWhatsApp', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Pincodes */}
        <div className="settings-card settings-card--full">
          <div className="settings-card-header">
            <MapPin size={20} /><h3>Serviceable Pincodes</h3>
          </div>
          <div className="settings-card-body">
            <div className="pincode-add">
              <input
                type="text"
                placeholder="Enter 6-digit pincode"
                value={newPincode}
                onChange={e => setNewPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={e => e.key === 'Enter' && addPincode()}
              />
              <Button size="sm" icon={<Plus size={14} />} onClick={addPincode} disabled={newPincode.length !== 6}>Add</Button>
            </div>
            <div className="pincodes-list">
              {config.serviceablePincodes.map(pin => (
                <span key={pin} className="pincode-tag">
                  {pin}
                  <button onClick={() => removePincode(pin)} className="pincode-remove"><X size={12} /></button>
                </span>
              ))}
            </div>
            <p className="settings-hint">{config.serviceablePincodes.length} pincodes configured</p>
          </div>
        </div>
      </div>
    </div>
  );
}
