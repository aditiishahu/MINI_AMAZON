import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, Check,
  ChevronRight, Package, Heart, MapPin, LogOut,
  Shield, Bell, CreditCard, Star, Edit2, Camera
} from "lucide-react";
import { UserContext } from "../context/UserContext";

const API_LOGIN    = "http://localhost:5000/api/users/login";
const API_REGISTER = "http://localhost:5000/api/users/register";

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

const PasswordInput = ({ value, onChange, placeholder, error, id }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border rounded px-3 py-2 text-sm pr-10 outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] transition-colors ${error ? "border-[#CC0C39]" : "border-gray-300"}`}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
};

const TextInput = ({ error, className = "", ...props }) => (
  <input
    className={`w-full border rounded px-3 py-2 text-sm outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] transition-colors ${error ? "border-[#CC0C39]" : "border-gray-300"} ${className}`}
    {...props}
  />
);

// ─── Password strength meter ──────────────────────────────────────────────────
const PasswordStrength = ({ password }) => {
  const checks = [
    { label: "8+ characters",      pass: password.length >= 8 },
    { label: "Uppercase letter",   pass: /[A-Z]/.test(password) },
    { label: "Number",             pass: /\d/.test(password) },
    { label: "Special character",  pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < score ? colors[score - 1] : "bg-gray-200"}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${score <= 1 ? "text-red-500" : score === 2 ? "text-orange-500" : score === 3 ? "text-yellow-600" : "text-green-600"}`}>
          {password ? labels[score - 1] || "Weak" : ""}
        </span>
        <div className="flex gap-2">
          {checks.map((c) => (
            <span key={c.label} className={`text-[10px] flex items-center gap-0.5 ${c.pass ? "text-green-600" : "text-gray-400"}`}>
              <Check size={9} /> {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN FORM
// ═══════════════════════════════════════════════════════════════════════════════
const LoginForm = ({ onSwitch, onSuccess }) => {
  const { login } = useContext(UserContext);
  const [form, setForm]       = useState({ email: "", password: "", remember: false });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.email.trim())               e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password)                   e.password = "Password is required";
    else if (form.password.length < 6)    e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      if (form.remember) localStorage.setItem("amazon_mini_remember", form.email);
      login(data.user || data);
      onSuccess();
    } catch (err) {
      setApiError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill remembered email
  useEffect(() => {
    const remembered = localStorage.getItem("amazon_mini_remember");
    if (remembered) setForm((p) => ({ ...p, email: remembered, remember: true }));
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-[#CC0C39] text-sm flex items-start gap-2">
          <span className="mt-0.5">⚠️</span> {apiError}
        </div>
      )}

      <Field label="Email" required error={errors.email}>
        <div className="relative">
          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <TextInput
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            error={errors.email}
            className="pl-9"
          />
        </div>
      </Field>

      <Field label="Password" required error={errors.password}>
        <PasswordInput
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          placeholder="Your password"
          error={errors.password}
        />
      </Field>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.remember}
            onChange={(e) => set("remember", e.target.checked)}
            className="accent-[#FF9900] w-4 h-4"
          />
          <span className="text-sm text-[#0F1111]">Keep me signed in</span>
        </label>
        <button type="button" className="text-[#007185] text-sm hover:underline hover:text-[#C7511F]">
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold py-2.5 rounded-full text-sm border border-[#FCD200] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? <><span className="w-4 h-4 border-2 border-[#0F1111]/30 border-t-[#0F1111] rounded-full animate-spin" /> Signing in…</> : "Sign in"}
      </button>

      <div className="relative flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">New to MiniAmazon?</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        type="button"
        onClick={onSwitch}
        className="w-full bg-white hover:bg-gray-50 text-[#0F1111] font-medium py-2.5 rounded-full text-sm border border-gray-300 transition-colors"
      >
        Create your account
      </button>
    </form>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// REGISTER FORM
// ═══════════════════════════════════════════════════════════════════════════════
const RegisterForm = ({ onSwitch, onSuccess }) => {
  const { login } = useContext(UserContext);
  const [form, setForm]       = useState({ name: "", email: "", phone: "", password: "", confirm: "", agree: false });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())                           e.name     = "Full name is required";
    if (!form.email.trim())                          e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))      e.email    = "Enter a valid email";
    if (form.phone && !/^\d{10}$/.test(form.phone)) e.phone    = "Enter valid 10-digit number";
    if (!form.password)                              e.password = "Password is required";
    else if (form.password.length < 8)               e.password = "Minimum 8 characters";
    if (form.confirm !== form.password)              e.confirm  = "Passwords do not match";
    if (!form.agree)                                 e.agree    = "Please accept the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch(API_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      login(data.user || data);
      onSuccess();
    } catch (err) {
      setApiError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-[#CC0C39] text-sm flex items-start gap-2">
          <span className="mt-0.5">⚠️</span> {apiError}
        </div>
      )}

      <Field label="Full Name" required error={errors.name}>
        <div className="relative">
          <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <TextInput value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="John Doe" error={errors.name} className="pl-9" />
        </div>
      </Field>

      <Field label="Email" required error={errors.email}>
        <div className="relative">
          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <TextInput type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" error={errors.email} className="pl-9" />
        </div>
      </Field>

      <Field label="Mobile Number" error={errors.phone}>
        <div className="relative">
          <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <TextInput value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="10-digit mobile (optional)" error={errors.phone} className="pl-9" maxLength={10} />
        </div>
      </Field>

      <Field label="Password" required error={errors.password}>
        <PasswordInput value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min. 8 characters" error={errors.password} />
        <PasswordStrength password={form.password} />
      </Field>

      <Field label="Confirm Password" required error={errors.confirm}>
        <PasswordInput value={form.confirm} onChange={(e) => set("confirm", e.target.value)} placeholder="Re-enter your password" error={errors.confirm} />
        {form.confirm && form.confirm === form.password && (
          <p className="text-green-600 text-xs flex items-center gap-1 mt-0.5"><Check size={11} /> Passwords match</p>
        )}
      </Field>

      <div>
        <label className="flex items-start gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={form.agree} onChange={(e) => set("agree", e.target.checked)} className="accent-[#FF9900] w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-xs text-gray-600 leading-relaxed">
            By creating an account, you agree to MiniAmazon's{" "}
            <span className="text-[#007185] hover:underline cursor-pointer">Conditions of Use</span> and{" "}
            <span className="text-[#007185] hover:underline cursor-pointer">Privacy Notice</span>.
          </span>
        </label>
        {errors.agree && <p className="text-[#CC0C39] text-xs mt-0.5 ml-6">{errors.agree}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold py-2.5 rounded-full text-sm border border-[#FCD200] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? <><span className="w-4 h-4 border-2 border-[#0F1111]/30 border-t-[#0F1111] rounded-full animate-spin" /> Creating account…</> : "Create your account"}
      </button>

      <div className="relative flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">Already have an account?</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        type="button"
        onClick={onSwitch}
        className="w-full bg-white hover:bg-gray-50 text-[#0F1111] font-medium py-2.5 rounded-full text-sm border border-gray-300 transition-colors"
      >
        Sign in instead
      </button>
    </form>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH PAGE (Login + Register combined)
// ═══════════════════════════════════════════════════════════════════════════════
const AuthPage = () => {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const navigate        = useNavigate();
  const location        = useLocation();
  const from            = location.state?.from || "/";

  const handleSuccess = () => navigate(from, { replace: true });

  return (
    <div className="min-h-screen bg-[#EAEDED] flex flex-col items-center py-8 px-4">
      {/* Logo */}
      <Link to="/" className="mb-6">
        <div className="flex flex-col items-center leading-none">
          <span className="text-[#131921] font-extrabold text-3xl tracking-tight">amazon</span>
          <span className="text-[#FF9900] text-xs font-bold tracking-widest">.mini</span>
        </div>
      </Link>

      {/* Card */}
      <div className="bg-white rounded-sm border border-gray-200 shadow-sm w-full max-w-sm p-7">
        {/* Tab switcher */}
        <div className="flex border border-gray-200 rounded-full overflow-hidden mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "login" ? "bg-[#232F3E] text-white" : "bg-white text-[#007185] hover:bg-gray-50"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "register" ? "bg-[#232F3E] text-white" : "bg-white text-[#007185] hover:bg-gray-50"}`}
          >
            Create Account
          </button>
        </div>

        <h1 className="text-xl font-bold text-[#0F1111] mb-5">
          {mode === "login" ? "Sign in" : "Create account"}
        </h1>

        {mode === "login"
          ? <LoginForm    onSwitch={() => setMode("register")} onSuccess={handleSuccess} />
          : <RegisterForm onSwitch={() => setMode("login")}    onSuccess={handleSuccess} />
        }
      </div>

      {/* Footer links */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs text-[#007185]">
        {["Conditions of Use", "Privacy Notice", "Help"].map((l) => (
          <span key={l} className="hover:underline cursor-pointer">{l}</span>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2">© 2024 MiniAmazon.com, Inc.</p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// USER PROFILE PAGE
// ═══════════════════════════════════════════════════════════════════════════════

// Mock orders for display
const MOCK_ORDERS = [
  { id: "MNI-10293847", date: "8 Mar 2025",  status: "Delivered",   total: 2598, items: 2 },
  { id: "MNI-20384756", date: "22 Feb 2025", status: "Shipped",     total: 1299, items: 1 },
  { id: "MNI-30475869", date: "5 Feb 2025",  status: "Delivered",   total: 4799, items: 3 },
  { id: "MNI-40586970", date: "18 Jan 2025", status: "Cancelled",   total: 899,  items: 1 },
];

const STATUS_STYLES = {
  Delivered:  "bg-green-100 text-green-700",
  Shipped:    "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Cancelled:  "bg-red-100 text-red-700",
};

const QuickLink = ({ icon, label, sub, to }) => (
  <Link to={to} className="flex items-center gap-3 p-4 border border-gray-200 rounded-sm hover:shadow-md hover:border-gray-300 transition-all group bg-white">
    <div className="w-10 h-10 rounded-full bg-[#EAEDED] flex items-center justify-center text-[#FF9900] group-hover:bg-[#FF9900] group-hover:text-white transition-colors flex-shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-sm font-medium text-[#0F1111] group-hover:text-[#C7511F]">{label}</p>
      <p className="text-xs text-gray-500 truncate">{sub}</p>
    </div>
    <ChevronRight size={16} className="text-gray-300 ml-auto flex-shrink-0" />
  </Link>
);

const ProfilePage = () => {
  const { user, logout } = useContext(UserContext);
  const navigate          = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode]   = useState(false);
  const [profileData, setProfileData] = useState({
    name:    user?.name    || "",
    email:   user?.email   || "",
    phone:   user?.phone   || "",
    address: user?.address || "",
  });

  const handleLogout = () => { logout(); navigate("/"); };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "orders",   label: "Orders" },
    { id: "security", label: "Security" },
  ];

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-4 py-4">

        {/* Breadcrumb */}
        <nav className="text-xs text-[#007185] mb-3 flex items-center gap-1">
          <Link to="/" className="hover:underline">Home</Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-[#0F1111]">Your Account</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-4">

          {/* ── Left Sidebar ── */}
          <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-3">

            {/* Profile card */}
            <div className="bg-white rounded-sm shadow-sm p-5 flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="w-20 h-20 rounded-full bg-[#232F3E] flex items-center justify-center text-white text-3xl font-bold">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-[#FF9900] rounded-full flex items-center justify-center shadow">
                  <Camera size={12} className="text-white" />
                </button>
              </div>
              <h2 className="font-bold text-[#0F1111] text-base">{user?.name || "User"}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{user?.email || ""}</p>
              <div className="flex items-center gap-1 mt-2">
                {[1,2,3,4,5].map((s) => <Star key={s} size={12} className="fill-[#FF9900] text-[#FF9900]" />)}
                <span className="text-xs text-gray-500 ml-1">Prime Member</span>
              </div>
            </div>

            {/* Nav */}
            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 text-sm border-b border-gray-100 last:border-0 flex items-center justify-between transition-colors ${
                    activeTab === tab.id ? "bg-orange-50 text-[#C7511F] font-medium border-l-2 border-l-[#FF9900]" : "text-[#0F1111] hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                  <ChevronRight size={14} className="text-gray-300" />
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-[#CC0C39] hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* ── OVERVIEW TAB ── */}
            {activeTab === "overview" && (
              <>
                {/* Quick links */}
                <section className="bg-white rounded-sm shadow-sm p-5">
                  <h2 className="text-lg font-bold text-[#0F1111] mb-4">Your Account</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <QuickLink icon={<Package size={18} />}    label="Your Orders"   sub="Track, return or buy again"  to="#" />
                    <QuickLink icon={<Shield size={18} />}     label="Login & Security" sub="Edit name, email, password" to="#" />
                    <QuickLink icon={<MapPin size={18} />}     label="Your Addresses" sub="Edit addresses for orders"   to="#" />
                    <QuickLink icon={<CreditCard size={18} />} label="Payment Options" sub="Manage payment methods"     to="#" />
                    <QuickLink icon={<Heart size={18} />}      label="Wishlist"       sub="View your saved items"       to="#" />
                    <QuickLink icon={<Bell size={18} />}       label="Notifications"  sub="Manage your preferences"     to="#" />
                  </div>
                </section>

                {/* Profile info */}
                <section className="bg-white rounded-sm shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#0F1111]">Personal Information</h2>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="flex items-center gap-1.5 text-[#007185] hover:text-[#C7511F] text-sm"
                    >
                      <Edit2 size={14} /> {editMode ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  {editMode ? (
                    <div className="flex flex-col gap-4 max-w-lg">
                      <Field label="Full Name" required error={null}>
                        <TextInput value={profileData.name} onChange={(e) => setProfileData((p) => ({ ...p, name: e.target.value }))} />
                      </Field>
                      <Field label="Email" required error={null}>
                        <TextInput type="email" value={profileData.email} onChange={(e) => setProfileData((p) => ({ ...p, email: e.target.value }))} />
                      </Field>
                      <Field label="Mobile" error={null}>
                        <TextInput value={profileData.phone} onChange={(e) => setProfileData((p) => ({ ...p, phone: e.target.value }))} placeholder="10-digit mobile number" />
                      </Field>
                      <Field label="Default Address" error={null}>
                        <textarea
                          value={profileData.address}
                          onChange={(e) => setProfileData((p) => ({ ...p, address: e.target.value }))}
                          placeholder="Your delivery address"
                          rows={3}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] resize-none"
                        />
                      </Field>
                      <button
                        onClick={() => setEditMode(false)}
                        className="self-start bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold px-6 py-2 rounded-full text-sm border border-[#FCD200]"
                      >
                        Save changes
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "Full Name",    value: profileData.name    || "—" },
                        { label: "Email",        value: profileData.email   || "—" },
                        { label: "Mobile",       value: profileData.phone   || "Not added" },
                        { label: "Address",      value: profileData.address || "Not added" },
                      ].map((row) => (
                        <div key={row.label} className="border-b border-gray-100 pb-3">
                          <p className="text-xs text-gray-500 mb-0.5">{row.label}</p>
                          <p className="text-sm text-[#0F1111] font-medium">{row.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Recent orders */}
                <section className="bg-white rounded-sm shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#0F1111]">Recent Orders</h2>
                    <button onClick={() => setActiveTab("orders")} className="text-[#007185] text-sm hover:underline">See all</button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {MOCK_ORDERS.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 flex-wrap gap-2">
                        <div>
                          <p className="text-sm font-medium text-[#0F1111]">{order.id}</p>
                          <p className="text-xs text-gray-500">{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[order.status]}`}>{order.status}</span>
                          <span className="text-sm font-bold text-[#0F1111]">₹{order.total.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* ── ORDERS TAB ── */}
            {activeTab === "orders" && (
              <section className="bg-white rounded-sm shadow-sm p-5">
                <h2 className="text-lg font-bold text-[#0F1111] mb-4">Your Orders</h2>
                {MOCK_ORDERS.length === 0 ? (
                  <div className="text-center py-10">
                    <Package size={48} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">You haven't placed any orders yet.</p>
                    <Link to="/products" className="text-[#007185] hover:underline text-sm mt-2 inline-block">Start shopping</Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {MOCK_ORDERS.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-sm overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 flex flex-wrap items-center gap-4 justify-between border-b border-gray-200">
                          <div className="flex flex-wrap gap-6">
                            <div><p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">Order placed</p><p className="text-sm text-[#0F1111]">{order.date}</p></div>
                            <div><p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">Total</p><p className="text-sm font-bold text-[#0F1111]">₹{order.total.toLocaleString("en-IN")}</p></div>
                            <div><p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">Items</p><p className="text-sm text-[#0F1111]">{order.items}</p></div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">Order # {order.id}</p>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[order.status]}`}>{order.status}</span>
                          </div>
                        </div>
                        <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-3">
                          <div className="flex gap-2">
                            {Array(order.items).fill(null).map((_, i) => (
                              <div key={i} className="w-14 h-14 border border-gray-200 rounded bg-gray-50 flex items-center justify-center text-2xl">🛍️</div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            {order.status === "Delivered" && (
                              <button className="text-sm text-[#007185] hover:text-[#C7511F] border border-gray-300 rounded-full px-3 py-1 hover:border-[#C7511F] transition-colors">
                                Buy it again
                              </button>
                            )}
                            <button className="text-sm text-[#007185] hover:text-[#C7511F] border border-gray-300 rounded-full px-3 py-1 hover:border-[#C7511F] transition-colors">
                              View order
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ── SECURITY TAB ── */}
            {activeTab === "security" && (
              <section className="bg-white rounded-sm shadow-sm p-5">
                <h2 className="text-lg font-bold text-[#0F1111] mb-5">Login & Security</h2>
                <div className="flex flex-col gap-4 max-w-lg">
                  {[
                    { label: "Name",     value: user?.name  || "—",  action: "Edit" },
                    { label: "Email",    value: user?.email || "—",  action: "Edit" },
                    { label: "Password", value: "••••••••••",         action: "Change" },
                    { label: "Mobile",   value: user?.phone || "Not added", action: "Add" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 gap-4">
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5 font-medium">{row.label}</p>
                        <p className="text-sm text-[#0F1111] font-medium truncate">{row.value}</p>
                      </div>
                      <button className="flex-shrink-0 text-[#007185] hover:text-[#C7511F] text-sm font-medium border border-gray-300 rounded-full px-4 py-1 hover:border-[#C7511F] transition-colors">
                        {row.action}
                      </button>
                    </div>
                  ))}

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="font-bold text-[#0F1111] text-sm mb-3">Two-Step Verification</h3>
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-sm p-3">
                      <div>
                        <p className="text-sm font-medium text-[#0F1111]">Authenticator app</p>
                        <p className="text-xs text-gray-500">Add an extra layer of security</p>
                      </div>
                      <button className="text-[#007185] hover:text-[#C7511F] text-sm font-medium border border-gray-300 rounded-full px-4 py-1 hover:border-[#C7511F] transition-colors flex-shrink-0">
                        Set up
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT — shows Auth or Profile based on login state
// ═══════════════════════════════════════════════════════════════════════════════
const UserProfile = () => {
  const { user } = useContext(UserContext);
  return user ? <ProfilePage /> : <AuthPage />;
};

export default UserProfile;
