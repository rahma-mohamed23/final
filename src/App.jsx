import { useState, useEffect, useReducer, useCallback } from "react";

/* ─── DESIGN TOKENS ─── */
const C = {
  bg: "#0a0a0f",
  surface: "#12121a",
  card: "#1a1a26",
  border: "#2a2a3e",
  gold: "#c9a84c",
  goldLight: "#e8c96a",
  accent: "#7b5ea7",
  text: "#f0ede8",
  muted: "#8a8799",
  danger: "#e05555",
  success: "#4caf7d",
};

/* ─── GLOBAL STYLES ─── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: ${C.bg}; color: ${C.text}; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${C.bg}; }
    ::-webkit-scrollbar-thumb { background: ${C.gold}; border-radius: 2px; }
    .serif { font-family: 'Cormorant Garamond', serif; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes shimmer { 0%,100%{opacity:.6} 50%{opacity:1} }
    @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
    @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
    @keyframes spin { to{transform:rotate(360deg)} }
    .fade-up { animation: fadeUp .6s ease both; }
    .fade-up-2 { animation: fadeUp .6s .15s ease both; }
    .fade-up-3 { animation: fadeUp .6s .3s ease both; }
    .gold-shimmer { animation: shimmer 2s infinite; }
    button { cursor: pointer; border: none; background: none; font-family: inherit; }
    input, textarea, select { font-family: inherit; }
    a { text-decoration: none; color: inherit; }
  `}</style>
);

/* ─── PRODUCTS DATA ─── */
const PRODUCTS = [
  { id: 1, name: "Obsidian Chronograph", category: "Watches", price: 1290, originalPrice: 1890, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", badge: "Best Seller", rating: 4.9, reviews: 312, description: "Swiss-movement timepiece with sapphire crystal glass and hand-stitched Italian leather strap. Water resistant to 100m. A masterwork of precision engineering." },
  { id: 2, name: "Noir Leather Tote", category: "Bags", price: 680, originalPrice: null, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", badge: "New", rating: 4.8, reviews: 184, description: "Full-grain calfskin leather with hand-burnished edges. Interior suede lining with gold-plated hardware. Fits a 15-inch laptop with room to spare." },
  { id: 3, name: "Aurora Silk Scarf", category: "Accessories", price: 320, originalPrice: 420, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80", badge: "Sale", rating: 4.7, reviews: 97, description: "100% mulberry silk printed with original artwork. Each piece is individually numbered. Hand-rolled edges. Dimensions: 90×90cm." },
  { id: 4, name: "Midnight Perfume", category: "Fragrance", price: 245, originalPrice: null, image:"https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80", badge: null, rating: 4.9, reviews: 441, description: "A deep, complex fragrance opening with bergamot and black pepper, heart of oud and rose, base of amber and vetiver. 50ml Eau de Parfum." },
  { id: 5, name: "Cashmere Overcoat", category: "Clothing", price: 1850, originalPrice: 2400, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80", badge: "Sale", rating: 4.8, reviews: 63, description: "Double-faced 100% Mongolian cashmere, unlined to showcase the fabric's natural drape. Dry clean only. Available in Charcoal, Camel, Ivory." },
  { id: 6, name: "Crystal Sunglasses", category: "Accessories", price: 490, originalPrice: null, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80", badge: "New", rating: 4.6, reviews: 129, description: "Hand-crafted acetate frames with polarized mineral glass lenses. UV400 protection. Comes with a leather case and silk cloth. Made in Italy." },
  { id: 7, name: "Gold Signet Ring", category: "Jewelry", price: 780, originalPrice: null, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80", badge: null, rating: 5.0, reviews: 88, description: "18K yellow gold signet ring with a flat top for engraving. Handcrafted by master goldsmiths. Available in sizes 5–12. Complimentary engraving included." },
  { id: 8, name: "Velvet Chelsea Boots", category: "Shoes", price: 920, originalPrice: 1100, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", badge: "Sale", rating: 4.7, reviews: 205, description: "Midnight-navy velvet upper with elasticated side panels and Cuban heel. Leather sole and insole. Made in Spain by hand." },
];

const CATEGORIES = ["All", ...new Set(PRODUCTS.map(p => p.category))];

/* ─── CART REDUCER ─── */
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD": {
      const existing = state.find(i => i.id === action.product.id);
      if (existing) return state.map(i => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.product, qty: 1 }];
    }
    case "REMOVE": return state.filter(i => i.id !== action.id);
    case "UPDATE_QTY": return state.map(i => i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i);
    case "CLEAR": return [];
    default: return state;
  }
};

/* ─── ICONS ─── */
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    cart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
    heart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    heartFill: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    arrowLeft: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    mail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 12 19.79 19.79 0 01.21 3.44 2 2 0 012.18 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.18 6.18l1.47-1.47a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
    location: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    minus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    instagram: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="1" fill={color}/></svg>,
    twitter: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  };
  return icons[name] || null;
};

/* ─── NAVBAR ─── */
const Navbar = ({ page, setPage, cartCount, wishlistCount, onCartOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = ["Home", "Products", "About", "Contact"];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? `rgba(10,10,15,0.96)` : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition: "all .35s ease",
      padding: "0 clamp(1rem, 4vw, 3rem)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        {/* Logo */}
        <button onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, border: `1.5px solid ${C.gold}`, transform: "rotate(45deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 10, height: 10, background: C.gold, transform: "rotate(-45deg)" }} />
          </div>
          <span className="serif" style={{ fontSize: 22, fontWeight: 600, letterSpacing: 3, color: C.text }}>LUXE</span>
        </button>

        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: 40, alignItems: "center" }} className="desktop-nav">
          {navLinks.map(link => (
            <button key={link} onClick={() => setPage(link.toLowerCase())} style={{
              color: page === link.toLowerCase() ? C.gold : C.muted,
              fontSize: 12, letterSpacing: 2, fontWeight: 500, textTransform: "uppercase",
              transition: "color .2s", borderBottom: page === link.toLowerCase() ? `1px solid ${C.gold}` : "1px solid transparent", paddingBottom: 2,
            }}>{link}</button>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <button onClick={() => setPage("wishlist")} style={{ position: "relative", color: C.muted, transition: "color .2s" }}>
            <Icon name="heart" size={22} color={wishlistCount > 0 ? C.gold : C.muted} />
            {wishlistCount > 0 && <span style={{ position: "absolute", top: -6, right: -6, background: C.gold, color: C.bg, fontSize: 10, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{wishlistCount}</span>}
          </button>
          <button onClick={onCartOpen} style={{ position: "relative", color: C.muted }}>
            <Icon name="cart" size={22} color={C.muted} />
            {cartCount > 0 && <span style={{ position: "absolute", top: -6, right: -6, background: C.gold, color: C.bg, fontSize: 10, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{cartCount}</span>}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ color: C.muted, display: "none" }} className="mobile-menu-btn">
            <Icon name={menuOpen ? "close" : "menu"} size={24} color={C.muted} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: "1.5rem 2rem 2rem" }}>
          {navLinks.map(link => (
            <button key={link} onClick={() => { setPage(link.toLowerCase()); setMenuOpen(false); }} style={{
              display: "block", width: "100%", textAlign: "left", padding: "1rem 0",
              color: page === link.toLowerCase() ? C.gold : C.text, fontSize: 14, letterSpacing: 2, textTransform: "uppercase",
              borderBottom: `1px solid ${C.border}`,
            }}>{link}</button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

/* ─── CART SIDEBAR ─── */
const CartSidebar = ({ cart, dispatch, onClose, setPage }) => {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = total > 500 ? 0 : 25;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200, backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", right: 0, top: 0, bottom: 0, width: "min(440px, 100vw)", zIndex: 201,
        background: C.surface, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column",
        animation: "slideIn .3s ease",
      }}>
        {/* Header */}
        <div style={{ padding: "1.5rem 2rem", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="serif" style={{ fontSize: 22, letterSpacing: 2 }}>Your Cart</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: C.muted, fontSize: 13 }}>{cart.reduce((s, i) => s + i.qty, 0)} items</span>
            <button onClick={onClose}><Icon name="close" size={22} color={C.muted} /></button>
          </div>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 2rem" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: C.muted }}>
              <Icon name="cart" size={48} color={C.border} />
              <p style={{ marginTop: "1rem", fontSize: 14, letterSpacing: 1 }}>YOUR CART IS EMPTY</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 16, padding: "1.25rem 0", borderBottom: `1px solid ${C.border}` }}>
              <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 4 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{item.name}</p>
                <p style={{ color: C.gold, fontSize: 13, marginBottom: 12 }}>${item.price.toLocaleString()}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 0, border: `1px solid ${C.border}`, borderRadius: 4 }}>
                    <button onClick={() => item.qty === 1 ? dispatch({ type: "REMOVE", id: item.id }) : dispatch({ type: "UPDATE_QTY", id: item.id, qty: item.qty - 1 })} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
                      <Icon name="minus" size={14} color={C.muted} />
                    </button>
                    <span style={{ width: 32, textAlign: "center", fontSize: 14 }}>{item.qty}</span>
                    <button onClick={() => dispatch({ type: "UPDATE_QTY", id: item.id, qty: item.qty + 1 })} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
                      <Icon name="plus" size={14} color={C.muted} />
                    </button>
                  </div>
                  <button onClick={() => dispatch({ type: "REMOVE", id: item.id })} style={{ color: C.danger }}>
                    <Icon name="trash" size={16} color={C.danger} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: "1.5rem 2rem", borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: C.muted }}>
              <span>Subtotal</span><span>${total.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 13, color: C.muted }}>
              <span>Shipping</span><span>{shipping === 0 ? <span style={{ color: C.success }}>Free</span> : `$${shipping}`}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontWeight: 600, fontSize: 16 }}>
              <span>Total</span><span style={{ color: C.gold }}>${(total + shipping).toLocaleString()}</span>
            </div>
            {shipping > 0 && <p style={{ fontSize: 11, color: C.muted, marginBottom: 12, textAlign: "center" }}>Add ${(500 - total).toLocaleString()} more for free shipping</p>}
            <button onClick={() => { onClose(); setPage("checkout"); }} style={{
              width: "100%", padding: "1rem", background: C.gold, color: C.bg,
              fontSize: 12, letterSpacing: 2, fontWeight: 600, textTransform: "uppercase",
              borderRadius: 4, transition: "opacity .2s",
            }}>Proceed to Checkout</button>
            <button onClick={() => dispatch({ type: "CLEAR" })} style={{ width: "100%", padding: ".75rem", marginTop: 8, color: C.muted, fontSize: 12, letterSpacing: 1 }}>Clear Cart</button>
          </div>
        )}
      </div>
    </>
  );
};

/* ─── PRODUCT CARD ─── */
const ProductCard = ({ product, onAdd, onWishlist, isWishlisted, setPage, setSelectedProduct }) => {
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    setAdding(true);
    onAdd(product);
    setTimeout(() => setAdding(false), 1500);
  };

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => { setSelectedProduct(product); setPage("product"); }}
      style={{ cursor: "pointer", background: C.card, borderRadius: 8, overflow: "hidden", border: `1px solid ${hovered ? C.gold : C.border}`, transition: "border-color .25s, transform .25s", transform: hovered ? "translateY(-4px)" : "none" }}>
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "4/3" }}>
        <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s", transform: hovered ? "scale(1.06)" : "scale(1)" }} />
        {product.badge && (
          <span style={{ position: "absolute", top: 12, left: 12, background: product.badge === "Sale" ? C.danger : product.badge === "New" ? C.accent : C.gold, color: "#fff", fontSize: 10, letterSpacing: 1.5, padding: "4px 10px", fontWeight: 600, textTransform: "uppercase", borderRadius: 2 }}>{product.badge}</span>
        )}
        <button onClick={e => { e.stopPropagation(); onWishlist(product.id); }} style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, background: "rgba(10,10,15,.8)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={isWishlisted ? "heartFill" : "heart"} size={16} color={isWishlisted ? C.gold : C.text} />
        </button>
      </div>
      <div style={{ padding: "1.25rem" }}>
        <p style={{ fontSize: 11, color: C.muted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>{product.category}</p>
        <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{product.name}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          {[1,2,3,4,5].map(i => <Icon key={i} name="star" size={11} color={i <= Math.round(product.rating) ? C.gold : C.border} />)}
          <span style={{ fontSize: 11, color: C.muted }}>({product.reviews})</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ color: C.gold, fontWeight: 600, fontSize: 17 }}>${product.price.toLocaleString()}</span>
            {product.originalPrice && <span style={{ color: C.muted, fontSize: 13, textDecoration: "line-through" }}>${product.originalPrice.toLocaleString()}</span>}
          </div>
          <button onClick={handleAdd} style={{
            background: adding ? C.success : C.gold, color: C.bg, borderRadius: 4,
            width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background .3s", flexShrink: 0,
          }}>
            {adding ? <Icon name="check" size={16} color={C.bg} /> : <Icon name="plus" size={16} color={C.bg} />}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── HOME PAGE ─── */
const HomePage = ({ products, cart, dispatch, wishlist, toggleWishlist, setPage, setSelectedProduct }) => {
  const featured = products.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
        background: `radial-gradient(ellipse 80% 60% at 60% 40%, rgba(123,94,167,.15), transparent), radial-gradient(ellipse 50% 40% at 30% 70%, rgba(201,168,76,.08), transparent), ${C.bg}`,
      }}>
        {/* Background pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201,168,76,.06) 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
        
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 clamp(1.5rem, 6vw, 4rem)", maxWidth: 900, margin: "0 auto" }}>
          <p className="fade-up" style={{ fontSize: 11, letterSpacing: 5, color: C.gold, textTransform: "uppercase", marginBottom: 24, fontWeight: 500 }}>The New Collection — 2025</p>
          <h1 className="serif fade-up-2" style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)", fontWeight: 300, lineHeight: 1.05, marginBottom: 24, color: C.text }}>
            Luxury<br /><em style={{ color: C.gold, fontStyle: "italic" }}>Redefined</em>
          </h1>
          <p className="fade-up-3" style={{ fontSize: 16, color: C.muted, maxWidth: 480, margin: "0 auto 48px", lineHeight: 1.7 }}>
            Curated pieces for those who demand the extraordinary. Every item a statement. Every purchase a legacy.
          </p>
          <div className="fade-up-3" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("products")} style={{
              padding: "1rem 2.5rem", background: C.gold, color: C.bg,
              fontSize: 12, letterSpacing: 2, fontWeight: 600, textTransform: "uppercase", borderRadius: 4,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              Shop Collection <Icon name="arrow" size={16} color={C.bg} />
            </button>
            <button onClick={() => setPage("about")} style={{
              padding: "1rem 2.5rem", background: "transparent", color: C.text,
              fontSize: 12, letterSpacing: 2, fontWeight: 500, textTransform: "uppercase", borderRadius: 4,
              border: `1px solid ${C.border}`,
            }}>
              Our Story
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: C.muted }}>
          <span style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: `linear-gradient(${C.gold}, transparent)` }} />
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "4rem clamp(1.5rem, 6vw, 4rem)", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "2rem", textAlign: "center" }}>
          {[["12K+", "Happy Clients"], ["98%", "Satisfaction Rate"], ["50+", "Luxury Brands"], ["24/7", "Concierge Support"]].map(([num, label]) => (
            <div key={label}>
              <p className="serif" style={{ fontSize: 36, color: C.gold, fontWeight: 300, marginBottom: 6 }}>{num}</p>
              <p style={{ fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase" }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: "5rem clamp(1.5rem, 6vw, 4rem)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: 11, color: C.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Handpicked for you</p>
            <h2 className="serif" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300 }}>Featured Pieces</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {featured.map(p => (
              <ProductCard key={p.id} product={p} onAdd={product => dispatch({ type: "ADD", product })}
                onWishlist={toggleWishlist} isWishlisted={wishlist.includes(p.id)} setPage={setPage} setSelectedProduct={setSelectedProduct} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <button onClick={() => setPage("products")} style={{
              padding: ".875rem 2.5rem", border: `1px solid ${C.gold}`, color: C.gold,
              fontSize: 12, letterSpacing: 2, textTransform: "uppercase", borderRadius: 4,
              transition: "all .2s",
            }}>View All Products</button>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section style={{ margin: "0 clamp(1.5rem, 6vw, 4rem) 5rem", borderRadius: 12, overflow: "hidden", position: "relative", minHeight: 280, display: "flex", alignItems: "center", background: `linear-gradient(135deg, ${C.surface}, #1e1a2e)`, border: `1px solid ${C.border}` }}>
        <div style={{ position: "absolute", right: -60, bottom: -60, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(${C.gold}22, transparent 70%)` }} />
        <div style={{ padding: "3rem clamp(2rem, 6vw, 5rem)", position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 11, color: C.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Limited Time</p>
          <h3 className="serif" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 300, marginBottom: 16 }}>Free Shipping<br />on orders over $500</h3>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>Use code <strong style={{ color: C.gold }}>LUXE500</strong> at checkout</p>
          <button onClick={() => setPage("products")} style={{ padding: ".875rem 2rem", background: C.gold, color: C.bg, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", borderRadius: 4, fontWeight: 600 }}>Shop Now</button>
        </div>
      </section>
    </div>
  );
};

/* ─── PRODUCTS PAGE ─── */
const ProductsPage = ({ products, dispatch, wishlist, toggleWishlist, setPage, setSelectedProduct }) => {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");

  const filtered = products
    .filter(p => category === "All" || p.category === category)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div style={{ paddingTop: 100, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(1.5rem, 4vw, 3rem)" }}>
        {/* Header */}
        <div style={{ textAlign: "center", padding: "3rem 0 2rem" }}>
          <p style={{ fontSize: 11, color: C.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Our Collection</p>
          <h1 className="serif" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 300, marginBottom: 16 }}>All Products</h1>
          <p style={{ color: C.muted, fontSize: 14 }}>{filtered.length} items available</p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between", marginBottom: 36, padding: "1.5rem", background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding: "6px 16px", borderRadius: 20, fontSize: 12, letterSpacing: 1, textTransform: "uppercase",
                background: category === cat ? C.gold : "transparent",
                color: category === cat ? C.bg : C.muted,
                border: `1px solid ${category === cat ? C.gold : C.border}`,
                transition: "all .2s", fontWeight: category === cat ? 600 : 400,
              }}>{cat}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <Icon name="search" size={16} color={C.muted} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{
                paddingLeft: 28, paddingRight: 12, paddingTop: 8, paddingBottom: 8, background: C.card,
                border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 13, outline: "none", width: 180,
              }} />
              <Icon name="search" size={14} color={C.muted} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{
              padding: "8px 32px 8px 12px", background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 6, color: C.text, fontSize: 12, outline: "none", cursor: "pointer",
            }}>
              <option value="default">Sort: Default</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24, paddingBottom: "5rem" }}>
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onAdd={product => dispatch({ type: "ADD", product })}
              onWishlist={toggleWishlist} isWishlisted={wishlist.includes(p.id)} setPage={setPage} setSelectedProduct={setSelectedProduct} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── PRODUCT DETAIL PAGE ─── */
const ProductDetailPage = ({ product, dispatch, wishlist, toggleWishlist, setPage }) => {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) dispatch({ type: "ADD", product });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ paddingTop: 100, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem clamp(1.5rem, 4vw, 3rem)" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "2.5rem", fontSize: 12, color: C.muted }}>
          <button onClick={() => setPage("home")} style={{ color: C.muted }}>Home</button>
          <span>/</span>
          <button onClick={() => setPage("products")} style={{ color: C.muted }}>Products</button>
          <span>/</span>
          <span style={{ color: C.text }}>{product.name}</span>
        </div>

        {/* Main */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, marginBottom: "5rem", alignItems: "start" }}>
          {/* Image */}
          <div style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "1", position: "relative" }}>
            <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {product.badge && (
              <span style={{ position: "absolute", top: 20, left: 20, background: product.badge === "Sale" ? C.danger : product.badge === "New" ? C.accent : C.gold, color: "#fff", fontSize: 11, letterSpacing: 2, padding: "6px 14px", fontWeight: 600, textTransform: "uppercase", borderRadius: 2 }}>{product.badge}</span>
            )}
          </div>

          {/* Info */}
          <div>
            <p style={{ fontSize: 11, color: C.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>{product.category}</p>
            <h1 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, marginBottom: 16, lineHeight: 1.2 }}>{product.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[1,2,3,4,5].map(i => <Icon key={i} name="star" size={14} color={i <= Math.round(product.rating) ? C.gold : C.border} />)}
              </div>
              <span style={{ fontSize: 13, color: C.muted }}>{product.rating} ({product.reviews} reviews)</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 28 }}>
              <span style={{ color: C.gold, fontSize: 32, fontWeight: 600 }}>${product.price.toLocaleString()}</span>
              {product.originalPrice && <span style={{ color: C.muted, fontSize: 18, textDecoration: "line-through" }}>${product.originalPrice.toLocaleString()}</span>}
            </div>
            <p style={{ color: C.muted, lineHeight: 1.8, fontSize: 15, marginBottom: 32 }}>{product.description}</p>

            {/* Qty + Add */}
            <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 48, height: 52, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, borderRight: `1px solid ${C.border}` }}>
                  <Icon name="minus" size={16} color={C.muted} />
                </button>
                <span style={{ width: 52, textAlign: "center", fontSize: 16 }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 48, height: 52, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, borderLeft: `1px solid ${C.border}` }}>
                  <Icon name="plus" size={16} color={C.muted} />
                </button>
              </div>
              <button onClick={handleAdd} style={{
                flex: 1, minWidth: 200, padding: "1rem 2rem", background: added ? C.success : C.gold, color: C.bg,
                fontSize: 12, letterSpacing: 2, fontWeight: 600, textTransform: "uppercase", borderRadius: 6,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "background .3s",
              }}>
                {added ? <><Icon name="check" size={18} color={C.bg} /> Added to Cart</> : <><Icon name="cart" size={18} color={C.bg} /> Add to Cart</>}
              </button>
              <button onClick={() => toggleWishlist(product.id)} style={{ width: 52, height: 52, border: `1px solid ${C.border}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={wishlist.includes(product.id) ? "heartFill" : "heart"} size={20} color={wishlist.includes(product.id) ? C.gold : C.muted} />
              </button>
            </div>

            {/* Features */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              {[["Free shipping", "on orders over $500"], ["Luxury packaging", "gift-ready presentation"], ["30-day returns", "hassle-free policy"]].map(([title, sub]) => (
                <div key={title} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${C.gold}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="check" size={14} color={C.gold} />
                  </div>
                  <span style={{ fontSize: 13 }}><strong>{title}</strong> — {sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ paddingBottom: "5rem" }}>
            <h2 className="serif" style={{ fontSize: "2rem", fontWeight: 300, marginBottom: "2rem" }}>You May Also Like</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
              {related.map(p => (
                <ProductCard key={p.id} product={p} onAdd={prod => dispatch({ type: "ADD", product: prod })}
                  onWishlist={toggleWishlist} isWishlisted={wishlist.includes(p.id)} setPage={setPage} setSelectedProduct={() => {}} />
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`@media(max-width:768px){.product-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
};

/* ─── CHECKOUT PAGE ─── */
const CheckoutPage = ({ cart, dispatch, setPage }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", zip: "", country: "US", cardName: "", cardNumber: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = total > 500 ? 0 : 25;

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.firstName) e.firstName = "Required";
      if (!form.lastName) e.lastName = "Required";
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
      if (!form.address) e.address = "Required";
      if (!form.city) e.city = "Required";
      if (!form.zip) e.zip = "Required";
    }
    if (step === 2) {
      if (!form.cardName) e.cardName = "Required";
      if (!form.cardNumber || form.cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "Valid card number required";
      if (!form.expiry) e.expiry = "Required";
      if (!form.cvv || form.cvv.length < 3) e.cvv = "Required";
    }
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    if (step === 2) {
      setSubmitted(true);
      dispatch({ type: "CLEAR" });
    } else {
      setStep(s => s + 1);
    }
  };

  const Field = ({ label, name, placeholder, half, type = "text" }) => (
    <div style={{ flex: half ? "0 0 calc(50% - 8px)" : "1 1 100%" }}>
      <label style={{ display: "block", fontSize: 11, letterSpacing: 1.5, color: C.muted, textTransform: "uppercase", marginBottom: 8 }}>{label}</label>
      <input type={type} placeholder={placeholder} value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} style={{
        width: "100%", padding: "12px 16px", background: C.card, border: `1px solid ${errors[name] ? C.danger : C.border}`,
        borderRadius: 6, color: C.text, fontSize: 14, outline: "none",
      }} />
      {errors[name] && <p style={{ color: C.danger, fontSize: 11, marginTop: 4 }}>{errors[name]}</p>}
    </div>
  );

  if (submitted) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: `${C.success}22`, border: `2px solid ${C.success}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
          <Icon name="check" size={36} color={C.success} />
        </div>
        <h1 className="serif" style={{ fontSize: "3rem", fontWeight: 300, marginBottom: 16 }}>Order Confirmed</h1>
        <p style={{ color: C.muted, lineHeight: 1.7, marginBottom: 32, fontSize: 15 }}>Thank you for your purchase. A confirmation email has been sent to <strong style={{ color: C.text }}>{form.email}</strong>. Your order will arrive in 3–5 business days.</p>
        <button onClick={() => setPage("home")} style={{ padding: "1rem 2.5rem", background: C.gold, color: C.bg, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", borderRadius: 4, fontWeight: 600 }}>Back to Home</button>
      </div>
    </div>
  );

  if (cart.length === 0 && !submitted) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: C.muted, marginBottom: 24 }}>Your cart is empty.</p>
        <button onClick={() => setPage("products")} style={{ padding: "1rem 2rem", background: C.gold, color: C.bg, borderRadius: 4, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>Shop Now</button>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 100, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem clamp(1.5rem, 4vw, 3rem)" }}>
        <h1 className="serif" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, marginBottom: "2.5rem" }}>Checkout</h1>

        {/* Steps */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: "3rem" }}>
          {["Shipping", "Payment", "Review"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: step > i + 1 ? C.success : step === i + 1 ? C.gold : C.border, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {step > i + 1 ? <Icon name="check" size={14} color={C.bg} /> : <span style={{ fontSize: 12, fontWeight: 600, color: step === i + 1 ? C.bg : C.muted }}>{i + 1}</span>}
                </div>
                <span style={{ fontSize: 13, color: step === i + 1 ? C.text : C.muted, whiteSpace: "nowrap" }}>{s}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? C.success : C.border, margin: "0 12px" }} />}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 40, alignItems: "start" }}>
          {/* Form */}
          <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: "2rem" }}>
            {step === 1 && (
              <>
                <h2 style={{ fontSize: 18, marginBottom: "1.5rem", fontWeight: 500 }}>Shipping Information</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  <Field label="First Name" name="firstName" placeholder="rahma" half />
                  <Field label="Last Name" name="lastName" placeholder="mohamed" half />
                  <Field label="Email" name="email" placeholder="rahma@example.com" type="email" />
                  <Field label="Phone" name="phone" placeholder="+1 (555) 000-0000" type="tel" />
                  <Field label="Address" name="address" placeholder="123 Luxury Lane" />
                  <Field label="City" name="city" placeholder="New York" half />
                  <Field label="ZIP Code" name="zip" placeholder="10001" half />
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h2 style={{ fontSize: 18, marginBottom: "1.5rem", fontWeight: 500 }}>Payment Details</h2>
                <div style={{ background: `${C.gold}11`, border: `1px solid ${C.gold}44`, borderRadius: 6, padding: "12px 16px", marginBottom: "1.5rem" }}>
                  <p style={{ fontSize: 12, color: C.gold }}>🔒 This is a demo. No real payment is processed.</p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  <Field label="Cardholder Name" name="cardName" placeholder="John Doe" />
                  <Field label="Card Number" name="cardNumber" placeholder="1234 5678 9012 3456" />
                  <Field label="Expiry Date" name="expiry" placeholder="MM/YY" half />
                  <Field label="CVV" name="cvv" placeholder="123" half type="password" />
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <h2 style={{ fontSize: 18, marginBottom: "1.5rem", fontWeight: 500 }}>Review Your Order</h2>
                <div style={{ marginBottom: "1.5rem" }}>
                  <p style={{ fontSize: 12, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Shipping to</p>
                  <p style={{ fontSize: 14 }}>{form.firstName} {form.lastName}</p>
                  <p style={{ color: C.muted, fontSize: 13 }}>{form.address}, {form.city} {form.zip}</p>
                  <p style={{ color: C.muted, fontSize: 13 }}>{form.email}</p>
                </div>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "1.5rem" }}>
                  <p style={{ fontSize: 12, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Items</p>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 }}>
                      <span>{item.name} × {item.qty}</span>
                      <span style={{ color: C.gold }}>${(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: "2rem" }}> 
              {step > 1 && (
                <button onClick={() => setStep(s => s - 1)} style={{ padding: "1rem 1.5rem", border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="arrowLeft" size={16} color={C.muted} /> Back
                </button>
              )}
              <button onClick={handleNext} style={{ flex: 1, padding: "1rem", background: C.gold, color: C.bg, borderRadius: 6, fontSize: 12, letterSpacing: 2, fontWeight: 600, textTransform: "uppercase" }}>
                {step === 3 ? "Place Order" : "Continue"}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: "1.5rem", position: "sticky", top: 100 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: "1.25rem" }}>Order Summary</h3>
            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", gap: 12, marginBottom: "1rem" }}>
                <img src={item.image} alt={item.name} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 4 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, marginBottom: 2 }}>{item.name}</p>
                  <p style={{ color: C.muted, fontSize: 12 }}>Qty: {item.qty}</p>
                </div>
                <span style={{ color: C.gold, fontSize: 13, fontWeight: 500 }}>${(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "1rem", marginTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.muted, marginBottom: 8 }}>
                <span>Subtotal</span><span>${total.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.muted, marginBottom: 12 }}>
                <span>Shipping</span><span>{shipping === 0 ? <span style={{ color: C.success }}>Free</span> : `$${shipping}`}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: 16 }}>
                <span>Total</span><span style={{ color: C.gold }}>${(total + shipping).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.checkout-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
};

/* ─── WISHLIST PAGE ─── */
const WishlistPage = ({ wishlist, toggleWishlist, dispatch, setPage, setSelectedProduct }) => {
  const wishlistProducts = PRODUCTS.filter(p => wishlist.includes(p.id));
  return (
    <div style={{ paddingTop: 100, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem clamp(1.5rem, 4vw, 3rem)" }}>
        <div style={{ textAlign: "center", padding: "2rem 0 3rem" }}>
          <h1 className="serif" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, marginBottom: 8 }}>Wishlist</h1>
          <p style={{ color: C.muted }}>{wishlistProducts.length} saved items</p>
        </div>
        {wishlistProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: C.muted }}>
            <Icon name="heart" size={56} color={C.border} />
            <p style={{ marginTop: "1.5rem", marginBottom: "1.5rem", fontSize: 15 }}>Your wishlist is empty.</p>
            <button onClick={() => setPage("products")} style={{ padding: ".875rem 2rem", background: C.gold, color: C.bg, borderRadius: 4, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>Browse Products</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24, paddingBottom: "5rem" }}>
            {wishlistProducts.map(p => (
              <ProductCard key={p.id} product={p} onAdd={prod => dispatch({ type: "ADD", product: prod })} onWishlist={toggleWishlist} isWishlisted setPage={setPage} setSelectedProduct={setSelectedProduct} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── ABOUT PAGE ─── */
const AboutPage = () => (
  <div style={{ paddingTop: 100, minHeight: "100vh" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem clamp(1.5rem, 4vw, 3rem)" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "4rem 0 5rem", maxWidth: 700, margin: "0 auto" }}>
        <p style={{ fontSize: 11, color: C.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>Est. 2010 · Paris</p>
        <h1 className="serif" style={{ fontSize: "clamp(3rem, 8vw, 5rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: 24 }}>About<br /><em style={{ color: C.gold }}>LUXE</em></h1>
        <p style={{ color: C.muted, fontSize: 16, lineHeight: 1.8 }}>Born from a passion for the exceptional, LUXE was founded to bring the world's finest artisan goods to discerning collectors. Every piece we carry is personally vetted for quality, provenance, and beauty.</p>
      </div>

      {/* Values */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: "5rem" }}>
        {[
          { title: "Authenticity", text: "Every item is guaranteed authentic, sourced directly from master craftsmen and established luxury houses worldwide.", icon: "check" },
          { title: "Excellence", text: "Our rigorous curation process ensures only the finest 3% of products presented to us ever reach your hands.", icon: "star" },
          { title: "Sustainability", text: "We partner exclusively with brands committed to ethical sourcing, fair labor, and environmental responsibility.", icon: "heart" },
        ].map(({ title, text, icon }) => (
          <div key={title} style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, padding: "2.5rem 2rem" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${C.gold}22`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
              <Icon name={icon} size={22} color={C.gold} />
            </div>
            <h3 className="serif" style={{ fontSize: 22, fontWeight: 400, marginBottom: 12 }}>{title}</h3>
            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>{text}</p>
          </div>
        ))}
      </div>

      {/* Team */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h2 className="serif" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, marginBottom: 12 }}>The Founders</h2>
        <p style={{ color: C.muted, fontSize: 14 }}>A team united by a love of extraordinary things</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, paddingBottom: "5rem" }}>
        {[
          { name: "Isabelle Moreau", role: "CEO & Creative Director", img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80" },
          { name: "Alexandre Dupont", role: "Head of Curation", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
          { name: "Sophia Laurent", role: "Client Relations", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
          { name: "Marcus Chen", role: "Technology Lead", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
        ].map(({ name, role, img }) => (
          <div key={name} style={{ textAlign: "center" }}>
            <div style={{ width: 120, height: 120, borderRadius: "50%", overflow: "hidden", margin: "0 auto 1rem", border: `2px solid ${C.border}` }}>
              <img src={img} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <p style={{ fontWeight: 500, marginBottom: 4 }}>{name}</p>
            <p style={{ color: C.muted, fontSize: 13 }}>{role}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── CONTACT PAGE ─── */
const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };

  return (
    <div style={{ paddingTop: 100, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem clamp(1.5rem, 4vw, 3rem)" }}>
        <div style={{ textAlign: "center", padding: "3rem 0 4rem" }}>
          <p style={{ fontSize: 11, color: C.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>We'd love to hear from you</p>
          <h1 className="serif" style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", fontWeight: 300, marginBottom: 16 }}>Get in Touch</h1>
          <p style={{ color: C.muted, maxWidth: 480, margin: "0 auto", fontSize: 15, lineHeight: 1.7 }}>Our client relations team is available Monday–Saturday, 9am–7pm CET, to assist with any enquiries.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 48, marginBottom: "5rem" }}>
          {/* Info */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {[
                { icon: "location", title: "Our Showroom", text: "18 Rue du Faubourg Saint-Honoré\nParis, France 75008" },
                { icon: "phone", title: "Phone", text: "+33 (0)1 42 68 00 00" },
                { icon: "mail", title: "Email", text: "hello@luxe-store.com" },
              ].map(({ icon, title, text }) => (
                <div key={title} style={{ display: "flex", gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${C.gold}15`, border: `1px solid ${C.gold}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={icon} size={20} color={C.gold} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 500, marginBottom: 4 }}>{title}</p>
                    <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-line" }}>{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 40, padding: "1.5rem", background: C.card, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <p style={{ fontSize: 12, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Follow Us</p>
              <div style={{ display: "flex", gap: 16 }}>
                {["instagram", "twitter"].map(s => (
                  <button key={s} style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color .2s" }}>
                    <Icon name={s} size={18} color={C.muted} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: "2rem" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${C.success}22`, border: `2px solid ${C.success}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                  <Icon name="check" size={28} color={C.success} />
                </div>
                <h3 className="serif" style={{ fontSize: 24, fontWeight: 300, marginBottom: 12 }}>Message Sent!</h3>
                <p style={{ color: C.muted, fontSize: 14 }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  {[["Name", "name", "Your name", false], ["Email", "email", "your@email.com", false], ["Subject", "subject", "How can we help?", false], ["Message", "message", "Tell us more...", true]].map(([label, name, placeholder, isArea]) => (
                    <div key={name} style={{ flex: "1 1 100%" }}>
                      <label style={{ display: "block", fontSize: 11, letterSpacing: 1.5, color: C.muted, textTransform: "uppercase", marginBottom: 8 }}>{label}</label>
                      {isArea ? (
                        <textarea rows={5} placeholder={placeholder} value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} style={{ width: "100%", padding: "12px 16px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 14, outline: "none", resize: "vertical" }} />
                      ) : (
                        <input placeholder={placeholder} value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} style={{ width: "100%", padding: "12px 16px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 14, outline: "none" }} />
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={handleSubmit} style={{ marginTop: "1.5rem", width: "100%", padding: "1rem", background: C.gold, color: C.bg, fontSize: 12, letterSpacing: 2, fontWeight: 600, textTransform: "uppercase", borderRadius: 6 }}>Send Message</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── FOOTER ─── */
const Footer = ({ setPage }) => (
  <footer style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: "4rem clamp(1.5rem, 4vw, 3rem) 2rem" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: "3rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
            <div style={{ width: 28, height: 28, border: `1.5px solid ${C.gold}`, transform: "rotate(45deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 8, height: 8, background: C.gold, transform: "rotate(-45deg)" }} />
            </div>
            <span className="serif" style={{ fontSize: 20, fontWeight: 600, letterSpacing: 3 }}>LUXE</span>
          </div>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, maxWidth: 280 }}>Curating the world's finest luxury goods since 2010. Authenticity and excellence in every piece.</p>
        </div>
        {[
          { title: "Shop", links: ["All Products", "New Arrivals", "Best Sellers", "Sale"] },
          { title: "Company", links: ["About Us", "Contact", "Careers", "Press"] },
          { title: "Support", links: ["FAQ", "Shipping", "Returns", "Size Guide"] },
        ].map(({ title, links }) => (
          <div key={title}>
            <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: C.text, fontWeight: 500, marginBottom: "1.25rem" }}>{title}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {links.map(l => <button key={l} onClick={() => { if (l === "All Products" || l === "New Arrivals" || l === "Best Sellers" || l === "Sale") setPage("products"); if (l === "About Us") setPage("about"); if (l === "Contact") setPage("contact"); }} style={{ color: C.muted, fontSize: 13, textAlign: "left", transition: "color .2s" }}>{l}</button>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <p style={{ color: C.muted, fontSize: 12 }}>© 2025 LUXE. All rights reserved.</p>
        <p style={{ color: C.muted, fontSize: 12 }}>Designed with ♥ for the extraordinary.</p>
      </div>
    </div>
  </footer>
);

/* ─── NOTIFICATION TOAST ─── */
const Toast = ({ message, visible }) => (
  <div style={{
    position: "fixed", bottom: 32, left: "50%", transform: `translateX(-50%) translateY(${visible ? 0 : 80}px)`,
    background: C.success, color: "#fff", padding: "12px 24px", borderRadius: 8, fontSize: 14, fontWeight: 500,
    zIndex: 300, transition: "transform .3s ease", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap",
    boxShadow: "0 8px 32px rgba(0,0,0,.4)",
  }}>
    <Icon name="check" size={16} color="#fff" /> {message}
  </div>
);

/* ─── APP ─── */
export default function App() {
  const [page, setPage] = useState("home");
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState({ message: "", visible: false });

  // Load from localStorage
useEffect(() => {
  try {
    const savedCart = localStorage.getItem("luxe_cart");
    const savedWishlist = localStorage.getItem("luxe_wishlist");
    
    if (savedCart) {
      JSON.parse(savedCart).forEach(item => {
        dispatch({ type: "ADD", product: item });
      });
    }
    
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
    
  } catch {};
  
}, []); 
  // Save to localStorage
  useEffect(() => { try { localStorage.setItem("luxe_cart", JSON.stringify(cart)); } catch {} }, [cart]);
  useEffect(() => { try { localStorage.setItem("luxe_wishlist", JSON.stringify(wishlist)); } catch {} }, [wishlist]);

  const showToast = useCallback((msg) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  }, []);

  const smartDispatch = useCallback((action) => {
    dispatch(action);
    if (action.type === "ADD") showToast(`${action.product.name} added to cart`);
  }, [showToast]);

  const toggleWishlist = useCallback((id) => {
    setWishlist(w => {
      const isIn = w.includes(id);
      showToast(isIn ? "Removed from wishlist" : "Added to wishlist");
      return isIn ? w.filter(i => i !== id) : [...w, id];
    });
  }, [showToast]);

  // Scroll to top on page change
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const commonProps = { cart, dispatch: smartDispatch, wishlist, toggleWishlist, setPage, setSelectedProduct };

  return (
    <>
      <GlobalStyle />
      <Navbar page={page} setPage={setPage} cartCount={cartCount} wishlistCount={wishlist.length} onCartOpen={() => setCartOpen(true)} />
      {cartOpen && <CartSidebar cart={cart} dispatch={dispatch} onClose={() => setCartOpen(false)} setPage={setPage} />}
      <Toast message={toast.message} visible={toast.visible} />

      <main>
        {page === "home" && <HomePage products={PRODUCTS} {...commonProps} />}
        {page === "products" && <ProductsPage products={PRODUCTS} {...commonProps} />}
        {page === "product" && selectedProduct && <ProductDetailPage product={selectedProduct} dispatch={smartDispatch} wishlist={wishlist} toggleWishlist={toggleWishlist} setPage={setPage} />}
        {page === "cart" && <CheckoutPage cart={cart} dispatch={dispatch} setPage={setPage} />}
        {page === "checkout" && <CheckoutPage cart={cart} dispatch={dispatch} setPage={setPage} />}
        {page === "wishlist" && <WishlistPage wishlist={wishlist} toggleWishlist={toggleWishlist} dispatch={smartDispatch} setPage={setPage} setSelectedProduct={setSelectedProduct} />}
        {page === "about" && <AboutPage />}
        {page === "contact" && <ContactPage />}
      </main>

      <Footer setPage={setPage} />
    </>
  );
}
