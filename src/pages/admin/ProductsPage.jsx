import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit3, Trash2, Eye, EyeOff, Package, X, Image as ImageIcon } from 'lucide-react';
import { getProducts, addProduct, updateProduct, deleteProduct, toggleProductAvailability } from '../../services/dataService';
import { uploadProductImage } from '../../services/storageService';
import { formatPrice } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './ProductsPage.css';

const emptyProduct = {
  name: '', category: 'mangoes', description: '',
  images: [], variants: [{ label: '', price: '', weight: '' }],
  stockQuantity: 0, unit: 'kg', isAvailable: true, sortOrder: 1,
  seasonStart: '', seasonEnd: ''
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const prods = await getProducts();
      setProducts(prods);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ ...emptyProduct, sortOrder: products.length + 1 });
    setImageFiles([]);
    setImagePreviews([]);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      images: product.images || [],
      variants: product.variants.length > 0 ? product.variants : [{ label: '', price: '', weight: '' }],
      stockQuantity: product.stockQuantity,
      unit: product.unit,
      isAvailable: product.isAvailable,
      sortOrder: product.sortOrder,
      seasonStart: product.seasonStart || '',
      seasonEnd: product.seasonEnd || ''
    });
    setImageFiles([]);
    setImagePreviews(product.images || []);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData(emptyProduct);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const existingCount = formData.images.length;
    if (index < existingCount) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else {
      setImageFiles(prev => prev.filter((_, i) => i !== (index - existingCount)));
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === index ? { ...v, [field]: field === 'label' ? value : Number(value) } : v
      )
    }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { label: '', price: '', weight: '' }]
    }));
  };

  const removeVariant = (index) => {
    if (formData.variants.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category) return;
    setSaving(true);
    try {
      let imageUrls = [...formData.images];

      // Upload new images
      const productId = editingProduct?.id || `temp-${Date.now()}`;
      for (const file of imageFiles) {
        const url = await uploadProductImage(file, productId);
        imageUrls.push(url);
      }

      const productData = {
        ...formData,
        images: imageUrls,
        variants: formData.variants.filter(v => v.label && v.price),
        stockQuantity: Number(formData.stockQuantity),
        sortOrder: Number(formData.sortOrder)
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }

      await fetchProducts();
      closeModal();
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id, currentState) => {
    try {
      await toggleProductAvailability(id, !currentState);
      setProducts(prev => prev.map(p =>
        p.id === id ? { ...p, isAvailable: !currentState } : p
      ));
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading products..." />;

  return (
    <div className="admin-products">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>{products.length} total products</p>
        </div>
        <Button icon={<Plus size={18} />} onClick={openAddModal}>Add Product</Button>
      </div>

      <div className="products-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Variants</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product.id} className={!product.isAvailable ? 'row-disabled' : ''}>
                <td>
                  <div className="product-cell">
                    <img src={product.images?.[0]} alt={product.name} className="product-thumb" />
                    <div>
                      <strong className="product-cell-name">{product.name}</strong>
                      <span className="product-cell-desc">{product.description?.slice(0, 60)}...</span>
                    </div>
                  </div>
                </td>
                <td><Badge variant="gold" size="sm">{product.category}</Badge></td>
                <td>
                  <div className="variants-cell">
                    {product.variants?.map((v, i) => (
                      <span key={i} className="variant-tag">{v.label} — {formatPrice(v.price)}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`stock-value ${product.stockQuantity <= 10 ? 'stock-low' : ''} ${product.stockQuantity === 0 ? 'stock-zero' : ''}`}>
                    {product.stockQuantity} {product.unit}
                  </span>
                </td>
                <td>
                  <button
                    className={`toggle-btn ${product.isAvailable ? 'toggle-on' : 'toggle-off'}`}
                    onClick={() => handleToggle(product.id, product.isAvailable)}
                  >
                    {product.isAvailable ? <Eye size={14} /> : <EyeOff size={14} />}
                    {product.isAvailable ? 'Active' : 'Hidden'}
                  </button>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn" onClick={() => openEditModal(product)} title="Edit"><Edit3 size={15} /></button>
                    <button className="action-btn action-btn--danger" onClick={() => handleDelete(product.id)} title="Delete"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state"><Package size={40} /><p>No products found</p></div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-grid-admin">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Alphonso Mango"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}>
                    <option value="mangoes">Mangoes</option>
                    <option value="sweets">Sweets</option>
                    <option value="fruits">Fruits</option>
                  </select>
                </div>
                <div className="form-group form-group--full">
                  <label>Description *</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Product description..."
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={e => setFormData(p => ({ ...p, stockQuantity: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <select value={formData.unit} onChange={e => setFormData(p => ({ ...p, unit: e.target.value }))}>
                    <option value="kg">kg</option>
                    <option value="pcs">pcs</option>
                    <option value="gm">gm</option>
                    <option value="box">box</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={e => setFormData(p => ({ ...p, sortOrder: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Season</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="date"
                      value={formData.seasonStart}
                      onChange={e => setFormData(p => ({ ...p, seasonStart: e.target.value }))}
                      placeholder="Start"
                    />
                    <input
                      type="date"
                      value={formData.seasonEnd}
                      onChange={e => setFormData(p => ({ ...p, seasonEnd: e.target.value }))}
                      placeholder="End"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="form-group form-group--full">
                  <label>Product Images</label>
                  <div className="image-upload-grid">
                    {imagePreviews.map((preview, i) => (
                      <div key={i} className="image-preview">
                        <img src={preview} alt="" />
                        <button className="image-remove" onClick={() => removeImage(i)}><X size={12} /></button>
                      </div>
                    ))}
                    <div className="image-upload-area" onClick={() => fileInputRef.current?.click()}>
                      <ImageIcon size={24} />
                      <span>Add Image</span>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Variants */}
                <div className="form-group form-group--full">
                  <label>Variants (Size / Price / Weight)</label>
                  <div className="variants-editor">
                    {formData.variants.map((v, i) => (
                      <div key={i} className="variant-row">
                        <input
                          type="text"
                          placeholder="Label (e.g. 1 kg box)"
                          value={v.label}
                          onChange={e => updateVariant(i, 'label', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={v.price}
                          onChange={e => updateVariant(i, 'price', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Weight"
                          value={v.weight}
                          onChange={e => updateVariant(i, 'weight', e.target.value)}
                        />
                        {formData.variants.length > 1 && (
                          <button className="variant-remove" onClick={() => removeVariant(i)}>
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button className="add-variant-btn" onClick={addVariant}>+ Add Variant</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button onClick={handleSave} loading={saving}>
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
