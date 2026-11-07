import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrainCircuit, Sparkles, Code2, Search, Bug, Network, Settings,
  FolderKanban, Activity, Send, CheckCircle2, CircleAlert, LoaderCircle,
  ExternalLink, Menu, X, Cpu, ShieldCheck, Layers3
} from "lucide-react";
import "./style.css";

const models = [
  ["ChatGPT", "OpenAI", "نموذج خارجي — يحتاج ربط API"],
  ["Claude", "Anthropic", "نموذج خارجي — يحتاج ربط API"],
  ["Gemini", "Google", "المحرك المتاح في النسخة الأولى"],
  ["Perplexity", "Perplexity AI", "يحتاج ربط API"],
  ["DeepSeek", "DeepSeek", "يحتاج ربط API"],
  ["Grok", "xAI", "يحتاج ربط API"],
  ["Mistral", "Mistral AI", "يحتاج ربط API"],
  ["Qwen", "Alibaba", "يحتاج ربط API"]
];

const devTools = [
  ["Google AI Studio", "https://aistudio.google.com/", "بناء وتجربة تطبيقات الذكاء الاصطناعي"],
  ["Replit Agent", "https://replit.com/", "بناء وتشغيل التطبيقات"],
  ["Lovable", "https://lovable.dev/", "إنشاء تطبيقات ويب بالمحادثة"],
  ["Bolt.new", "https://bolt.new/", "توليد تطبيقات الويب"],
  ["v0", "https://v0.app/", "توليد واجهات وتطبيقات"],
  ["Base44", "https://base44.com/", "بناء تطبيقات من وصف"],
  ["Emergent", "https://emergent.sh/", "بناء تطبيقات بالوكلاء"],
  ["Cursor", "https://cursor.com/", "محرر برمجي بالذكاء الاصطناعي"],
  ["Claude Code", "https://www.anthropic.com/claude-code", "وكيل برمجة"],
  ["OpenAI Codex", "https://openai.com/codex/", "وكيل برمجة"],
  ["GitHub Copilot", "https://github.com/features/copilot", "مساعد برمجي"],
  ["Google Antigravity", "https://antigravity.google/", "بيئة تطوير بالوكلاء"]
];

const nav = [
  ["الرئيسية", "home", Activity],
  ["غرفة العقول", "brains", BrainCircuit],
  ["مصنع التطوير", "factory", Code2],
  ["مركز البحث", "research", Search],
  ["مختبر الإصلاح", "lab", Bug],
  ["مدير المشاريع", "projects", FolderKanban],
  ["التكاملات", "integrations", Network]
];

function App() {
  const [page, setPage] = useState("home");
  const [task, setTask] = useState("");
  const [health, setHealth] = useState({ server: "checking", gemini: "checking" });
  const [busy, setBusy] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState("");
  const [mobileNav, setMobileNav] = useState(false);

  async function checkHealth() {
    try {
      const r = await fetch("/api/health");
      const d = await r.json();
      setHealth(d);
    } catch {
      setHealth({ server: "offline", gemini: "unknown" });
    }
  }
  useEffect(() => { checkHealth(); }, []);

  async function runTask(e) {
    e?.preventDefault();
    if (!task.trim() || busy) return;
    setBusy(true); setError(""); setOutput(null);
    try {
      const r = await fetch("/api/think", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "حدث خطأ أثناء التنفيذ");
      setOutput(data);
    } catch (err) {
      setError(err.message || "تعذر الاتصال بالخادم");
    } finally { setBusy(false); }
  }

  const statusText = health.gemini === "configured" ? "Gemini جاهز" :
    health.gemini === "needs_api_key" ? "أضف مفتاح Gemini" : "جارٍ فحص الاتصال";
  const active = nav.find(n => n[1] === page);

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? "show" : ""}`}>
      <div className="brand">
        <div className="brand-mark"><BrainCircuit size={27}/></div>
        <div><strong>ONE MIND</strong><small>العقل الواحد</small></div>
        <button className="mobile-close" onClick={() => setMobileNav(false)}><X/></button>
      </div>
      <div className="workspace"><span className="live-dot"/> مساحة العمل الرئيسية</div>
      <div className="nav-label">مساحة العمل</div>
      {nav.map(([label, id, Icon]) => <button key={id} className={`nav-item ${page === id ? "selected" : ""}`} onClick={() => {setPage(id);setMobileNav(false);}}>
        <Icon size={18}/><span>{label}</span>{id === "brains" && <i>8</i>}
      </button>)}
      <div className="sidebar-bottom">
        <div className="status-card">
          <div className="status-head"><span className="live-dot"/> حالة النظام</div>
          <p>الخادم: {health.server === "online" ? "متصل" : health.server === "offline" ? "غير متصل" : "يفحص..."}</p>
          <p>Gemini: {health.gemini === "configured" ? "مهيأ" : health.gemini === "needs_api_key" ? "ينتظر المفتاح" : "غير محدد"}</p>
          <button onClick={checkHealth}>إعادة الفحص</button>
        </div>
        <div className="profile"><div className="avatar">OM</div><div><b>مساحة المستخدم</b><small>النسخة التجريبية</small></div><Settings size={17}/></div>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileNav(true)}><Menu/></button>
        <div className="crumb">ONE MIND <span>/</span> {active?.[0] || "الرئيسية"}</div>
        <div className="top-actions"><span className="status-pill"><span className="live-dot"/>{statusText}</span><div className="avatar small">OM</div></div>
      </header>

      {page === "home" && <section className="content">
        <div className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={14}/> منظومة ذكاء اصطناعي تعاونية</div>
            <h1>عقول متعددة،<br/><em>رؤية واحدة.</em></h1>
            <p>اكتب هدفك مرة واحدة. يتولى العقل الواحد التحليل والتخطيط والمراجعة، ثم يجمع النتائج في مسار عمل واضح.</p>
            <div className="hero-tags"><span><ShieldCheck size={14}/> نتائج موضحة</span><span><Network size={14}/> تنسيق مركزي</span><span><Cpu size={14}/> قابلة للتوسع</span></div>
          </div>
          <div className="orb-wrap"><div className="orb"><BrainCircuit size={78}/><span className="orbit o1"/><span className="orbit o2"/><span className="orbit o3"/></div><div className="orb-caption">ONE MIND CORE <small>المحرك المركزي</small></div></div>
        </div>

        <div className="section-heading"><div><h2>ابدأ مهمة جديدة</h2><p>اطرح سؤالاً أو اطلب خطة أو ابدأ مشروعاً.</p></div><span className="tiny-label">مساحة العمل الذكية</span></div>
        <form className="prompt-card" onSubmit={runTask}>
          <textarea value={task} onChange={e => setTask(e.target.value)} placeholder="مثال: خطط لإنشاء منصة أدبية متكاملة، وحدد البنية التقنية وخطوات التنفيذ..." />
          <div className="prompt-footer"><span>سيحلل المحرك طلبك عبر أدوار متخصصة ثم يراجع النتيجة.</span><button className="primary-btn" disabled={busy || !task.trim()}>{busy ? <><LoaderCircle className="spin" size={17}/> جارٍ التفكير</> : <>ابدأ التحليل <Send size={16}/></>}</button></div>
        </form>
        <div className="quick-grid">
          {[
            [Code2,"إنشاء موقع أو تطبيق","حلل الفكرة وضع خطة بناء", "أريد خطة عملية لإنشاء موقع أو تطبيق من الصفر، تشمل الواجهة والخادم وقاعدة البيانات والاختبارات."],
            [Search,"بحث وتحليل","قارن المعلومات والحلول","حلل الموضوع التالي، وقارن الحلول الممكنة، وميز الحقائق عن الافتراضات."],
            [Bug,"مراجعة كود","اكتشف العيوب واقترح الإصلاح","ضع خطة منهجية لمراجعة كود برمجي واكتشاف أخطاء التشغيل والأمان وإصلاحها."]
          ].map(([Icon,title,desc,value])=><button className="quick-card" key={title} onClick={()=>{setTask(value);window.scrollTo({top:0,behavior:"smooth"});}}><Icon/><b>{title}</b><small>{desc}</small></button>)}
        </div>

        {error && <div className="error-box"><CircleAlert/>{error}</div>}
        {output && <div className="results">
          <div className="result-title"><div><span className="success-icon"><CheckCircle2/></span><div><h2>اكتمل التحليل</h2><p>تم تنفيذ الأدوار وجمع النتائج</p></div></div><span className="tiny-label">Gemini · أدوار متعددة</span></div>
          <div className="notice"><ShieldCheck size={17}/>{output.note}</div>
          <div className="final-answer"><h3>الخلاصة النهائية</h3><pre>{output.final}</pre></div>
          <h3 className="subheading">مراجعات العقول المتخصصة</h3>
          <div className="role-grid">{output.results?.map((r,i)=><article className="role-card" key={r.role}><span className="role-number">0{i+1}</span><h4>{r.role}</h4><pre>{r.text}</pre></article>)}</div>
        </div>}
      </section>}

      {page === "brains" && <section className="content">
        <PageTitle icon={BrainCircuit} title="غرفة العقول" desc="النماذج التي يمكن أن تشارك في التحليل. الاتصال الخارجي يتطلب إعداد API."/>
        <div className="model-grid">{models.map(([name,vendor,desc],i)=><div className="model-card" key={name}><div className="model-icon">{name.slice(0,1)}</div><div className="model-info"><b>{name}</b><small>{vendor}</small></div><span className={`connection ${name==="Gemini"&&health.gemini==="configured"?"connected":""}`}>{name==="Gemini"&&health.gemini==="configured"?"مهيأ":name==="Gemini"?"يحتاج مفتاح":"غير مربوط"}</span><p>{desc}</p></div>)}</div>
        <div className="notice"><ShieldCheck size={17}/> النسخة الحالية تستخدم Gemini في عدة أدوار متخصصة. بقية النماذج ظاهرة كخيارات تكامل مستقبلية وليست متصلة الآن.</div>
      </section>}

      {page === "factory" && <section className="content">
        <PageTitle icon={Code2} title="مصنع التطوير" desc="اختر منصة التطوير المناسبة. الروابط تفتح الخدمات الأصلية؛ الربط البرمجي يحتاج دعماً رسمياً وصلاحيات."/>
        <div className="tool-grid">{devTools.map(([name,url,desc])=><a className="tool-card" href={url} target="_blank" rel="noreferrer" key={name}><div className="tool-symbol"><Code2/></div><div><b>{name}</b><small>{desc}</small></div><ExternalLink size={16}/></a>)}</div>
        <div className="notice"><Layers3 size={17}/> هذه روابط مباشرة للخدمات وليست تكاملات API. يمكن إضافة الربط الحقيقي لكل خدمة على حدة عند توفر واجهتها وصلاحياتها.</div>
      </section>}

      {page === "research" && <section className="content"><PageTitle icon={Search} title="مركز البحث" desc="جهّز مهمة بحث ليحللها المحرك ويحدد ما يحتاج إلى مصادر خارجية."/><div className="empty-panel"><Search size={34}/><h3>البحث متعدد المصادر قيد التوسعة</h3><p>يمكنك حالياً استخدام مربع المهمة في الرئيسية لتحليل موضوعك. لا يدّعي النظام تصفح الويب ما لم تتم إضافة أداة بحث فعلية.</p><button className="secondary-btn" onClick={()=>setPage("home")}>ابدأ مهمة من الرئيسية</button></div></section>}

      {page === "lab" && <section className="content"><PageTitle icon={Bug} title="مختبر الإصلاح" desc="مساحة لتجهيز عمليات فحص الكود والاختبارات."/><div className="empty-panel"><Bug size={34}/><h3>مختبر الاختبارات</h3><p>هذه النسخة لا تنفذ كوداً مرفوعاً أو تفحص مستودعات خارجية بعد. أضف تكامل GitHub وبيئة تشغيل معزولة لتفعيل الفحص الحقيقي.</p><div className="check-list"><span><CheckCircle2/> فصل الواجهة عن الخادم</span><span><CheckCircle2/> معالجة أخطاء API</span><span><CircleAlert/> تشغيل اختبارات المشاريع الخارجية: غير متاح بعد</span></div></div></section>}

      {page === "projects" && <section className="content"><PageTitle icon={FolderKanban} title="مدير المشاريع" desc="مساحة أولية لتنظيم المشاريع القادمة."/><div className="empty-panel"><FolderKanban size={34}/><h3>لا توجد مشاريع محفوظة بعد</h3><p>ابدأ بمهمة من الصفحة الرئيسية. ستتم إضافة حفظ المشاريع وإدارة الملفات في مرحلة لاحقة.</p><button className="secondary-btn" onClick={()=>setPage("home")}>إنشاء مهمة</button></div></section>}

      {page === "integrations" && <section className="content"><PageTitle icon={Network} title="مركز التكاملات" desc="حالة الاتصال الفعلية للخدمات، وما يلزم لتفعيلها."/><div className="integration-summary"><div><b>{health.server==="online"?"الخادم يعمل":"الخادم غير متصل"}</b><small>خدمة التطبيق</small></div><div><b>{health.gemini==="configured"?"مفتاح موجود":"مفتاح غير مضبوط"}</b><small>Gemini API</small></div></div><div className="notice"><ShieldCheck size={17}/> لا تُدخل مفاتيح API في هذه الصفحة. أضفها في متغيرات بيئة الخادم فقط، ثم أعد تشغيل الخدمة.</div><div className="empty-panel compact"><Settings size={30}/><h3>إعداد Gemini</h3><p>أنشئ متغير بيئة باسم GEMINI_API_KEY في إعدادات أسرار المشروع. استخدم مفتاحاً من Google AI Studio ولا تشاركه مع أحد.</p><a className="secondary-btn link-btn" href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">الحصول على مفتاح Gemini <ExternalLink size={15}/></a></div></section>}
      <footer className="footer">ONE MIND © نسخة تأسيسية تجريبية <span>•</span> لا تعرض هذه النسخة إلا الاتصالات التي تم التحقق منها</footer>
    </main>
  </div>;
}

function PageTitle({icon:Icon,title,desc}) {
  return <div className="page-title"><div className="page-title-icon"><Icon size={24}/></div><div><h1>{title}</h1><p>{desc}</p></div></div>;
}

createRoot(document.getElementById("root")).render(<App/>);