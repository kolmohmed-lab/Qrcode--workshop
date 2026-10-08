import SubmissionForm from "./submission-form";

export default function Home() {
  return (
    <main className="site-shell">
      <section className="glass">
        <header className="brand-strip">
          <div>
            <div className="brand-context">DAIS & DHS Secondary</div>
            <div className="brand-name">Toddle with Ayman</div>
          </div>
          <div className="brand-mark" aria-hidden="true" />
        </header>
        <div className="panel">
          <div className="eyebrow">Workshop support</div>
          <h1>Questions<br />& issues</h1>
          <p className="intro">Ask a workshop question or tell me what is stopping you from using Toddle. I’ll check every submission and follow up.</p>
          <SubmissionForm />
        </div>
      </section>
    </main>
  );
}
