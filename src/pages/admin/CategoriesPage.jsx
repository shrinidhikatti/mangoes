import { useState, useEffect, useRef } from 'react';
import { Plus, Edit3, Trash2, Eye, EyeOff } from 'lucide-react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../services/dataService';
import { uploadCategoryImage } from '../../services/storageService';
import { slugify } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './CategoriesPage.css';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', sortOrder: 1, image: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => {
    setEditCat(null);
    setFormData({ name: '', description: '', sortOrder: categories.length + 1, image: '' });
    setImageFile(null);
    setImagePreview('');
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditCat(cat);
    setFormData({ name: cat.name, description: cat.description || '', sortOrder: cat.sortOrder, image: cat.image || '' });
    setImageFile(null);
    setImagePreview(cat.image || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditCat(null);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!formData.name) return;
    setSaving(true);
    try {
      let imageUrl = formData.image;
      const catId = editCat?.id || `temp-${Date.now()}`;
      if (imageFile) {
        imageUrl = await uploadCategoryImage(imageFile, catId);
      }
      const data = {
        name: formData.name,
        slug: slugify(formData.name),
        description: formData.description,
        sortOrder: Number(formData.sortOrder),
        image: imageUrl,
        isActive: editCat ? editCat.isActive : true
      };
      if (editCat) {
        await updateCategory(editCat.id, data);
      } else {
        await addCategory(data);
      }
      await fetchCategories();
      closeModal();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id, isActive) => {
    try {
      await updateCategory(id, { isActive: !isActive });
      setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: !isActive } : c));
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading categories..." />;

  return (
    <div className="admin-categories">
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>{categories.length} categories</p>
        </div>
        <Button icon={<Plus size={18} />} onClick={openAdd}>Add Category</Button>
      </div>

      <div className="categories-grid">
        {categories.sort((a, b) => a.sortOrder - b.sortOrder).map(cat => (
          <div key={cat.id} className={`category-admin-card ${!cat.isActive ? 'card-inactive' : ''}`}>
            <div className="cat-card-image">
              <img src={cat.image} alt={cat.name} />
              <div className="cat-card-overlay">
                <button className="cat-toggle" onClick={() => handleToggle(cat.id, cat.isActive)} title={cat.isActive ? 'Hide' : 'Show'}>
                  {cat.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
            <div className="cat-card-body">
              <div className="cat-card-info">
                <h3>{cat.name}</h3>
                <span className="cat-slug">/{cat.slug}</span>
                <span className="cat-order">Sort: {cat.sortOrder}</span>
              </div>
              <div className="cat-card-actions">
                <button className="action-btn" onClick={() => openEdit(cat)}><Edit3 size={15} /></button>
                <button className="action-btn action-btn--danger" onClick={() => handleDelete(cat.id)}><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editCat ? 'Edit Category' : 'Add Category'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-grid-admin" style={{ gridTemplateColumns: '1fr' }}>
                <div className="form-group">
                  <label>Category Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Mangoes" />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input type="text" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Short description" />
                </div>
                <div className="form-group">
                  <label>Sort Order</label>
                  <input type="number" value={formData.sortOrder} onChange={e => setFormData(p => ({ ...p, sortOrder: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Category Image</label>
                  <div className="image-upload-area" onClick={() => fileRef.current?.click()}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <>
                        <span>Click to upload</span>
                        <small>Recommended: 400x300px</small>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button onClick={handleSave} loading={saving}>{editCat ? 'Save' : 'Add Category'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
