import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2, ChevronRight, Zap, Shield, RotateCcw,
  Tag, ShoppingCart, Plus, Minus, Heart,
  MapPin, CreditCard, Truck, Check, Lock
} from "lucide-react";
import { UserContext } from "../context/UserContext";

// ─── Promo codes ──────────────────────────────────────────────────────────────
const PROMO_CODES = {
  SAVE10:  { type: "percent", value: 10,  label: "10% off" },
  FLAT200: { type: "flat",    value: 200, label: "₹200 off" },
  MINI100: { type: "flat",    value: 100, label: "₹100 off" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Field = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-[#0F1111]">
      {label} {required && <span className="text-[#CC0C39]">*</span>}
    </label>
    {children}
    {error && <p className="text-[#CC0C39] text-xs mt-0.5">{error}</p>}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] transition-colors w-full ${className}`}
    {...props}
  />
);

const Sel = ({ children, className = "", ...props }) => (
  <select
    className={`border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] bg-white w-full cursor-pointer ${className}`}
    {...props}
  >
    {children}
  </select>
);

// ─── Step Bar ─────────────────────────────────────────────────────────────────
const StepBar = ({ current }) => {
  const steps = ["Cart", "Address", "Delivery", "Payment", "Review"];
  return (
    <div className="flex items-center justify-center gap-0 mb-6 flex-wrap">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs sm:text-sm font-medium ${
            i < current ? "text-[#007185]" : i === current ? "text-[#0F1111] font-bold" : "text-gray-400"
          }`}>
            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border-2 flex-shrink-0 ${
              i < current  ? "bg-[#007185] border-[#007185] text-white" :
              i === current ? "bg-[#FF9900] border-[#FF9900] text-white" :
              "border-gray-300 text-gray-400"
            }`}>
              {i < current ? <Check size={10} /> : i + 1}
            </div>
            <span className="hidden sm:block">{s}</span>
          </div>
          {i < steps.length - 1 && <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />}
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 0 — CART
// ═══════════════════════════════════════════════════════════════════════════════
const CartStep = ({
  cartItems, savedItems, onQtyChange, onRemove, onSaveForLater, onMoveToCart,
  promoInput, setPromoInput, appliedPromo, promoError, promoSuccess,
  onApplyPromo, onRemovePromo, subtotal, discount, promoDiscount, onNext,
}) => {
  const deliveryCharge = subtotal > 499 ? 0 : 40;
  const total = subtotal - promoDiscount + deliveryCharge;

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-sm shadow-sm p-10 flex flex-col items-center text-center">
        <ShoppingCart size={80} className="text-gray-200 mb-4" />
        <h2 className="text-2xl font-bold text-[#0F1111] mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6 max-w-sm text-sm">Looks like you haven't added anything yet!</p>
        <Link to="/products" className="bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold px-8 py-3 rounded-full text-sm border border-[#FCD200]">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start">
      {/* Left */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">

        {/* Items */}
        <div className="bg-white rounded-sm shadow-sm px-5">
          <h1 className="text-2xl font-medium text-[#0F1111] py-4 border-b border-gray-200">Shopping Cart</h1>
          {cartItems.map((item) => {
            const id = item.id || item._id;
            const itemDiscount = item.originalPrice
              ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : null;
            return (
              <div key={id} className="flex gap-4 py-5 border-b border-gray-200 last:border-0">
                <Link to={`/product/${id}`} className="flex-shrink-0">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 border border-gray-200 rounded flex items-center justify-center bg-white overflow-hidden">
                    {item.image
                      ? <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
                      : <span className="text-5xl">🛍️</span>}
                  </div>
                </Link>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <Link to={`/product/${id}`}>
                    <h3 className="text-[#0F1111] text-base font-medium hover:text-[#C7511F] line-clamp-2">{item.title}</h3>
                  </Link>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <p className="text-[#007600] text-sm font-medium">In stock</p>
                    {item.prime && (
                      <div className="flex items-center gap-1">
                        <Zap size={12} className="fill-[#00A8E1] text-[#00A8E1]" />
                        <span className="text-[#00A8E1] text-xs font-bold">prime</span>
                      </div>
                    )}
                    {itemDiscount && <span className="text-[#CC0C39] text-xs font-medium">-{itemDiscount}%</span>}
                  </div>
                  <p className="text-xs text-gray-500">
                    Eligible for <span className="text-[#007185] font-medium">FREE Shipping</span>
                  </p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center border border-gray-300 rounded-full overflow-hidden text-sm">
                      <button onClick={() => onQtyChange(id, item.quantity - 1)} className="px-3 py-1.5 hover:bg-gray-100">
                        <Minus size={13} />
                      </button>
                      <span className="px-4 py-1.5 border-x border-gray-300 min-w-[40px] text-center font-medium">{item.quantity || 1}</span>
                      <button onClick={() => onQtyChange(id, item.quantity + 1)} className="px-3 py-1.5 hover:bg-gray-100">
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="text-gray-300">|</span>
                    <button onClick={() => onRemove(id)} className="flex items-center gap-1 text-[#007185] hover:text-[#C7511F] text-sm">
                      <Trash2 size={14} /> Delete
                    </button>
                    <span className="text-gray-300">|</span>
                    <button onClick={() => onSaveForLater(id)} className="flex items-center gap-1 text-[#007185] hover:text-[#C7511F] text-sm">
                      <Heart size={14} /> Save for later
                    </button>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-lg font-bold text-[#0F1111]">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}</p>
                  {(item.quantity || 1) > 1 && <p className="text-xs text-gray-500">₹{item.price?.toLocaleString("en-IN")} each</p>}
                  {item.originalPrice && <p className="text-xs text-gray-400 line-through">₹{(item.originalPrice * (item.quantity || 1)).toLocaleString("en-IN")}</p>}
                </div>
              </div>
            );
          })}
          <div className="py-4 text-right text-sm border-t border-gray-100">
            Subtotal ({cartItems.reduce((s, i) => s + (i.quantity || 1), 0)} items):{" "}
            <strong className="text-lg">₹{subtotal.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        {/* Promo */}
        <div className="bg-white rounded-sm shadow-sm p-5">
          <h3 className="font-bold text-[#0F1111] text-sm mb-3 flex items-center gap-2">
            <Tag size={16} className="text-[#FF9900]" /> Apply Promo Code
          </h3>
          {appliedPromo ? (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-3 py-2">
              <span className="text-[#007600] text-sm font-medium">{promoSuccess}</span>
              <button onClick={onRemovePromo} className="text-[#CC0C39] text-xs hover:underline ml-3">Remove</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input value={promoInput} onChange={(e) => setPromoInput(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === "Enter" && onApplyPromo()} placeholder="Enter promo code" className="uppercase placeholder:normal-case" />
              <button onClick={onApplyPromo} className="bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-medium px-4 py-2 rounded text-sm border border-[#FCD200]">Apply</button>
            </div>
          )}
          {promoError && <p className="text-[#CC0C39] text-xs mt-1.5">{promoError}</p>}
          <p className="text-xs text-gray-400 mt-1.5">Try: SAVE10 · FLAT200 · MINI100</p>
        </div>

        {/* Saved for later */}
        {savedItems.length > 0 && (
          <div className="bg-white rounded-sm shadow-sm p-5">
            <h3 className="font-bold text-[#0F1111] text-base mb-3">Saved for later ({savedItems.length})</h3>
            <div className="flex flex-col gap-4">
              {savedItems.map((item) => (
                <div key={item.id || item._id} className="flex gap-4 items-center border-b border-gray-100 pb-4 last:border-0">
                  <div className="w-20 h-20 border border-gray-200 rounded flex items-center justify-center bg-white flex-shrink-0">
                    {item.image ? <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" /> : <span className="text-3xl">🛍️</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0F1111] line-clamp-2">{item.title}</p>
                    <p className="text-base font-bold mt-1">₹{item.price?.toLocaleString("en-IN")}</p>
                    <button onClick={() => onMoveToCart(item)} className="mt-1 text-[#007185] hover:text-[#C7511F] text-sm hover:underline">Move to cart</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guarantees */}
        <div className="bg-white rounded-sm shadow-sm px-5 py-4 flex flex-wrap gap-6 justify-around">
          {[
            { icon: <Shield size={18} className="text-[#007600]" />, text: "Secure Payments" },
            { icon: <RotateCcw size={18} className="text-[#007600]" />, text: "30-Day Returns" },
            { icon: <Zap size={18} className="text-[#00A8E1]" />, text: "Prime Delivery" },
          ].map((g) => (
            <div key={g.text} className="flex items-center gap-2 text-sm text-gray-600">{g.icon}{g.text}</div>
          ))}
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="bg-white rounded-sm shadow-sm p-5 sticky top-[120px]">
          <h2 className="text-lg font-bold text-[#0F1111] mb-4">Order Summary</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Items subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
            {discount > 0 && <div className="flex justify-between text-[#007600]"><span>Discount</span><span>- ₹{discount.toLocaleString("en-IN")}</span></div>}
            {promoDiscount > 0 && <div className="flex justify-between text-[#007600]"><span>Promo ({appliedPromo})</span><span>- ₹{promoDiscount.toLocaleString("en-IN")}</span></div>}
            <div className="flex justify-between"><span className="text-gray-600">Delivery</span><span className={deliveryCharge === 0 ? "text-[#007600]" : ""}>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span></div>
            <div className="border-t border-gray-200 pt-3 mt-1 flex justify-between font-bold text-base"><span>Order Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
            {discount + promoDiscount > 0 && <p className="text-[#CC0C39] text-xs font-medium text-center mt-1">🎉 You save ₹{(discount + promoDiscount).toLocaleString("en-IN")}!</p>}
          </div>
          <button onClick={onNext} className="mt-4 w-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold py-3 rounded-full text-sm border border-[#FCD200]">
            Proceed to Checkout
          </button>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-500">
            <Shield size={12} className="text-[#007600]" /> Secure checkout — SSL encrypted
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1 — ADDRESS
// ═══════════════════════════════════════════════════════════════════════════════
const AddressStep = ({ data, onChange, onNext, onBack, errors }) => (
  <div className="bg-white rounded-sm shadow-sm p-6 max-w-2xl mx-auto">
    <h2 className="text-xl font-bold text-[#0F1111] mb-1 flex items-center gap-2">
      <MapPin size={20} className="text-[#FF9900]" /> Delivery Address
    </h2>
    <p className="text-sm text-gray-500 mb-5">Enter the address where you want your order delivered.</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <Field label="Full Name" required error={errors.fullName}><Input value={data.fullName} onChange={(e) => onChange("fullName", e.target.value)} placeholder="John Doe" /></Field>
      <Field label="Mobile Number" required error={errors.mobile}><Input value={data.mobile} onChange={(e) => onChange("mobile", e.target.value)} placeholder="10-digit mobile" maxLength={10} /></Field>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <Field label="Pincode" required error={errors.pincode}><Input value={data.pincode} onChange={(e) => onChange("pincode", e.target.value)} placeholder="6-digit pincode" maxLength={6} /></Field>
      <Field label="State" required error={errors.state}>
        <Sel value={data.state} onChange={(e) => onChange("state", e.target.value)}>
          <option value="">Select State</option>
          {["Andhra Pradesh","Bihar","Delhi","Gujarat","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","West Bengal"].map((s) => <option key={s} value={s}>{s}</option>)}
        </Sel>
      </Field>
    </div>
    <div className="mb-4"><Field label="Address Line 1" required error={errors.address1}><Input value={data.address1} onChange={(e) => onChange("address1", e.target.value)} placeholder="House No., Building, Street" /></Field></div>
    <div className="mb-4"><Field label="Address Line 2" error={null}><Input value={data.address2} onChange={(e) => onChange("address2", e.target.value)} placeholder="Area, Colony, Landmark (optional)" /></Field></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <Field label="City / District" required error={errors.city}><Input value={data.city} onChange={(e) => onChange("city", e.target.value)} placeholder="City" /></Field>
      <Field label="Address Type" error={null}>
        <Sel value={data.type} onChange={(e) => onChange("type", e.target.value)}>
          <option value="home">Home</option><option value="work">Work / Office</option><option value="other">Other</option>
        </Sel>
      </Field>
    </div>
    <div className="flex items-center gap-3">
      <button onClick={onBack} className="text-[#007185] hover:underline text-sm">← Back to Cart</button>
      <button onClick={onNext} className="bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold px-8 py-2.5 rounded-full text-sm border border-[#FCD200]">Deliver to this address</button>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2 — DELIVERY
// ═══════════════════════════════════════════════════════════════════════════════
const DeliveryStep = ({ selected, onSelect, onNext, onBack, prime }) => {
  const options = [
    { id: "standard", label: "Standard Delivery", sub: "5–7 business days", price: 0,   tag: prime ? "FREE with Prime" : "FREE over ₹499" },
    { id: "express",  label: "Express Delivery",  sub: "2–3 business days", price: 79,  tag: null },
    { id: "overnight",label: "Overnight Delivery",sub: "Next business day", price: 149, tag: "Fastest" },
  ];
  return (
    <div className="bg-white rounded-sm shadow-sm p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-[#0F1111] mb-1 flex items-center gap-2"><Truck size={20} className="text-[#FF9900]" /> Choose Delivery Speed</h2>
      <p className="text-sm text-gray-500 mb-5">Select a delivery option for your order.</p>
      <div className="flex flex-col gap-3 mb-6">
        {options.map((opt) => (
          <label key={opt.id} className={`flex items-start gap-3 border-2 rounded-sm p-4 cursor-pointer transition-colors ${selected === opt.id ? "border-[#FF9900] bg-orange-50" : "border-gray-200 hover:border-gray-400"}`}>
            <input type="radio" name="delivery" value={opt.id} checked={selected === opt.id} onChange={() => onSelect(opt.id)} className="mt-0.5 accent-[#FF9900]" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-[#0F1111] text-sm">{opt.label}</span>
                {opt.tag && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${opt.tag === "Fastest" ? "bg-[#CC0C39] text-white" : "bg-[#E8F4FA] text-[#007185]"}`}>{opt.tag}</span>}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{opt.sub}</p>
            </div>
            <span className={`text-sm font-bold flex-shrink-0 ${opt.price === 0 ? "text-[#007600]" : "text-[#0F1111]"}`}>{opt.price === 0 ? "FREE" : `₹${opt.price}`}</span>
          </label>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-[#007185] hover:underline text-sm">← Back</button>
        <button onClick={onNext} className="bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold px-8 py-2.5 rounded-full text-sm border border-[#FCD200]">Continue to Payment</button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3 — PAYMENT
// ═══════════════════════════════════════════════════════════════════════════════
const PaymentStep = ({ method, onMethod, cardData, onCard, onNext, onBack, errors }) => {
  const methods = [
    { id: "card",    label: "Credit / Debit Card", icon: "💳" },
    { id: "upi",     label: "UPI",                 icon: "📲" },
    { id: "netbank", label: "Net Banking",          icon: "🏦" },
    { id: "cod",     label: "Cash on Delivery",     icon: "💵" },
  ];
  return (
    <div className="bg-white rounded-sm shadow-sm p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-[#0F1111] mb-1 flex items-center gap-2"><CreditCard size={20} className="text-[#FF9900]" /> Payment Method</h2>
      <p className="text-sm text-gray-500 mb-5">All transactions are secure and encrypted.</p>
      <div className="flex flex-col gap-2 mb-5">
        {methods.map((m) => (
          <label key={m.id} className={`flex items-center gap-3 border-2 rounded-sm p-3.5 cursor-pointer transition-colors ${method === m.id ? "border-[#FF9900] bg-orange-50" : "border-gray-200 hover:border-gray-400"}`}>
            <input type="radio" name="payment" value={m.id} checked={method === m.id} onChange={() => onMethod(m.id)} className="accent-[#FF9900]" />
            <span className="text-lg">{m.icon}</span>
            <span className="text-sm font-medium text-[#0F1111]">{m.label}</span>
          </label>
        ))}
      </div>
      {method === "card" && (
        <div className="border border-gray-200 rounded-sm p-4 mb-5 bg-gray-50 flex flex-col gap-3">
          <Field label="Card Number" required error={errors.cardNumber}><Input value={cardData.number} onChange={(e) => onCard("number", e.target.value.replace(/\D/g,"").slice(0,16))} placeholder="1234 5678 9012 3456" maxLength={16} /></Field>
          <Field label="Cardholder Name" required error={errors.cardName}><Input value={cardData.name} onChange={(e) => onCard("name", e.target.value)} placeholder="Name on card" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Expiry" required error={errors.expiry}><Input value={cardData.expiry} onChange={(e) => onCard("expiry", e.target.value)} placeholder="MM/YY" maxLength={5} /></Field>
            <Field label="CVV" required error={errors.cvv}><Input value={cardData.cvv} onChange={(e) => onCard("cvv", e.target.value.replace(/\D/g,"").slice(0,3))} placeholder="•••" maxLength={3} type="password" /></Field>
          </div>
        </div>
      )}
      {method === "upi" && (
        <div className="border border-gray-200 rounded-sm p-4 mb-5 bg-gray-50">
          <Field label="UPI ID" required error={errors.upi}><Input value={cardData.upi || ""} onChange={(e) => onCard("upi", e.target.value)} placeholder="yourname@upi" /></Field>
        </div>
      )}
      {method === "cod" && (
        <div className="border border-[#FF9900] rounded-sm p-3 mb-5 bg-orange-50 text-sm text-gray-600">⚠️ An additional ₹30 COD convenience fee will be added at delivery.</div>
      )}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-5"><Lock size={12} className="text-[#007600]" /> Your payment info is encrypted with 256-bit SSL</div>
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-[#007185] hover:underline text-sm">← Back</button>
        <button onClick={onNext} className="bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold px-8 py-2.5 rounded-full text-sm border border-[#FCD200]">Review Order</button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 4 — REVIEW
// ═══════════════════════════════════════════════════════════════════════════════
const ReviewStep = ({ address, cartItems, total, onPlace, onBack, placing }) => (
  <div className="bg-white rounded-sm shadow-sm p-6 max-w-2xl mx-auto">
    <h2 className="text-xl font-bold text-[#0F1111] mb-5">Review Your Order</h2>
    <div className="border border-gray-200 rounded-sm p-4 mb-4">
      <h3 className="font-bold text-sm text-[#0F1111] mb-2 flex items-center gap-2"><MapPin size={15} className="text-[#FF9900]" /> Delivering to</h3>
      <p className="text-sm font-medium text-[#0F1111]">{address.fullName}</p>
      <p className="text-sm text-gray-600">{address.address1}{address.address2 ? `, ${address.address2}` : ""}</p>
      <p className="text-sm text-gray-600">{address.city}, {address.state} — {address.pincode}</p>
      <p className="text-sm text-gray-600">📞 {address.mobile}</p>
    </div>
    <div className="border border-gray-200 rounded-sm p-4 mb-4">
      <h3 className="font-bold text-sm text-[#0F1111] mb-3">{cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}</h3>
      <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.id || item._id} className="flex items-center gap-3">
            <div className="w-12 h-12 border border-gray-200 rounded flex items-center justify-center bg-white flex-shrink-0">
              {item.image ? <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" /> : <span className="text-xl">🛍️</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#0F1111] line-clamp-1">{item.title}</p>
              <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
            </div>
            <p className="text-sm font-bold text-[#0F1111] flex-shrink-0">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-lg font-bold text-[#0F1111] mb-5">
      <span>Order Total</span><span>₹{total.toLocaleString("en-IN")}</span>
    </div>
    <div className="flex items-center gap-3">
      <button onClick={onBack} className="text-[#007185] hover:underline text-sm">← Back</button>
      <button onClick={onPlace} disabled={placing} className="flex-1 sm:flex-none bg-[#FF9900] hover:bg-[#e88b00] text-white font-bold px-8 py-3 rounded-full text-sm border border-[#e88b00] flex items-center justify-center gap-2 disabled:opacity-70">
        {placing ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing Order…</> : <><Shield size={15} /> Place Order</>}
      </button>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SUCCESS
// ═══════════════════════════════════════════════════════════════════════════════
const SuccessScreen = ({ orderId }) => (
  <div className="bg-white rounded-sm shadow-sm p-10 flex flex-col items-center text-center max-w-2xl mx-auto">
    <div className="w-20 h-20 rounded-full bg-[#007600] flex items-center justify-center mb-4">
      <Check size={40} className="text-white" />
    </div>
    <h2 className="text-2xl font-bold text-[#0F1111] mb-2">Order Placed Successfully! 🎉</h2>
    <p className="text-gray-500 mb-1">Your order <strong className="text-[#0F1111]">#{orderId}</strong> has been confirmed.</p>
    <p className="text-gray-500 mb-6 text-sm">You'll receive a confirmation shortly.</p>
    <div className="flex flex-col sm:flex-row gap-3">
      <Link to="/" className="bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold px-6 py-2.5 rounded-full text-sm border border-[#FCD200]">Continue Shopping</Link>
      <Link to="/profile" className="bg-white hover:bg-gray-50 text-[#007185] font-medium px-6 py-2.5 rounded-full text-sm border border-gray-300">View Orders</Link>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT — Cart (contains full checkout flow)
// ═══════════════════════════════════════════════════════════════════════════════
const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, addToCart, cartTotal, clearCart } = useContext(UserContext);

  const [savedItems, setSavedItems]       = useState([]);
  const [promoInput, setPromoInput]       = useState("");
  const [appliedPromo, setAppliedPromo]   = useState(null);
  const [promoError, setPromoError]       = useState("");
  const [promoSuccess, setPromoSuccess]   = useState("");
  const [step, setStep]                   = useState(0);
  const [orderId, setOrderId]             = useState(null);
  const [placing, setPlacing]             = useState(false);
  const [address, setAddress]             = useState({ fullName:"", mobile:"", pincode:"", state:"", address1:"", address2:"", city:"", type:"home" });
  const [addressErrors, setAddressErrors] = useState({});
  const [delivery, setDelivery]           = useState("standard");
  const [payMethod, setPayMethod]         = useState("card");
  const [cardData, setCardData]           = useState({ number:"", name:"", expiry:"", cvv:"", upi:"" });
  const [payErrors, setPayErrors]         = useState({});

  const subtotal      = cartItems.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const totalOriginal = cartItems.reduce((s, i) => s + (i.originalPrice || i.price || 0) * (i.quantity || 1), 0);
  const discount      = Math.max(0, totalOriginal - subtotal);
  const promoDiscount = (() => {
    if (!appliedPromo) return 0;
    const p = PROMO_CODES[appliedPromo];
    return p.type === "flat" ? Math.min(p.value, subtotal) : Math.round(subtotal * p.value / 100);
  })();
  const deliveryFee = delivery === "express" ? 79 : delivery === "overnight" ? 149 : 0;
  const total       = subtotal - promoDiscount + deliveryFee;

  const handleQtyChange    = (id, qty) => qty < 1 ? removeFromCart(id) : updateQuantity(id, qty);
  const handleSaveForLater = (id) => { const item = cartItems.find((i) => (i.id || i._id) === id); if (item) { setSavedItems((p) => [...p, item]); removeFromCart(id); } };
  const handleMoveToCart   = (item) => { setSavedItems((p) => p.filter((i) => (i.id || i._id) !== (item.id || item._id))); addToCart?.(item); };

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    setPromoError(""); setPromoSuccess("");
    if (!code) { setPromoError("Please enter a promo code."); return; }
    if (PROMO_CODES[code]) { setAppliedPromo(code); setPromoSuccess(`✅ "${code}" applied — ${PROMO_CODES[code].label}!`); }
    else { setAppliedPromo(null); setPromoError("❌ Invalid code. Try: SAVE10, FLAT200, MINI100"); }
  };
  const handleRemovePromo = () => { setAppliedPromo(null); setPromoInput(""); setPromoSuccess(""); setPromoError(""); };

  const validateAddress = () => {
    const e = {};
    if (!address.fullName.trim())         e.fullName = "Required";
    if (!/^\d{10}$/.test(address.mobile)) e.mobile   = "Enter valid 10-digit number";
    if (!/^\d{6}$/.test(address.pincode)) e.pincode  = "Enter valid 6-digit pincode";
    if (!address.state)                   e.state    = "Please select a state";
    if (!address.address1.trim())         e.address1 = "Required";
    if (!address.city.trim())             e.city     = "Required";
    setAddressErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (payMethod === "card") {
      if (cardData.number.length < 16)              e.cardNumber = "Enter valid 16-digit number";
      if (!cardData.name.trim())                    e.cardName   = "Required";
      if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) e.expiry     = "Format: MM/YY";
      if (cardData.cvv.length < 3)                  e.cvv        = "Enter 3-digit CVV";
    }
    if (payMethod === "upi" && !cardData.upi?.includes("@")) e.upi = "Enter valid UPI ID";
    setPayErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 2000));
    const id = `MNI-${Date.now().toString().slice(-8)}`;
    setOrderId(id);
    clearCart?.();
    setPlacing(false);
    setStep(5);
  };

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-4 py-4">

        {/* Breadcrumb */}
        <nav className="text-xs text-[#007185] mb-3 flex items-center gap-1">
          <Link to="/" className="hover:underline">Home</Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span onClick={() => step > 0 && step < 5 && setStep(0)} className={`${step > 0 && step < 5 ? "hover:underline cursor-pointer text-[#007185]" : "text-[#0F1111]"}`}>
            Cart
          </span>
          {step > 0 && step < 5 && <><ChevronRight size={12} className="text-gray-400" /><span className="text-[#0F1111]">Checkout</span></>}
        </nav>

        {step > 0 && step < 5 && <StepBar current={step} />}

        {step === 0 && <CartStep cartItems={cartItems} savedItems={savedItems} onQtyChange={handleQtyChange} onRemove={removeFromCart} onSaveForLater={handleSaveForLater} onMoveToCart={handleMoveToCart} promoInput={promoInput} setPromoInput={setPromoInput} appliedPromo={appliedPromo} promoError={promoError} promoSuccess={promoSuccess} onApplyPromo={handleApplyPromo} onRemovePromo={handleRemovePromo} subtotal={subtotal} discount={discount} promoDiscount={promoDiscount} onNext={() => setStep(1)} />}
        {step === 1 && <AddressStep data={address} onChange={(k, v) => setAddress((p) => ({ ...p, [k]: v }))} onNext={() => { if (validateAddress()) setStep(2); }} onBack={() => setStep(0)} errors={addressErrors} />}
        {step === 2 && <DeliveryStep selected={delivery} onSelect={setDelivery} onNext={() => setStep(3)} onBack={() => setStep(1)} prime={cartItems.some((i) => i.prime)} />}
        {step === 3 && <PaymentStep method={payMethod} onMethod={setPayMethod} cardData={cardData} onCard={(k, v) => setCardData((p) => ({ ...p, [k]: v }))} onNext={() => { if (validatePayment()) setStep(4); }} onBack={() => setStep(2)} errors={payErrors} />}
        {step === 4 && <ReviewStep address={address} delivery={delivery} cartItems={cartItems} total={total} onPlace={handlePlaceOrder} onBack={() => setStep(3)} placing={placing} />}
        {step === 5 && <SuccessScreen orderId={orderId} />}
      </div>
    </div>
  );
};

export default Cart;
