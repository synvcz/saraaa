import { useEffect, useState } from 'react';

const scenes = [
  { id: 'first-frame', nav: '01', label: 'The first frame' },
  { id: 'about-sara', nav: '02', label: 'About Sara' },
  { id: 'beyond-surface', nav: '03', label: 'Beyond the surface' },
  { id: 'the-details', nav: '04', label: 'The details' },
  { id: 'why-sara', nav: '05', label: 'Why Sara' },
  { id: 'last-frame', nav: '06', label: 'The last frame' },
];

const provisionalPassage =
  'Not one scene. Not one trait. Not one reason that can be neatly separated from the rest. Perhaps it was the combination of everything that made me choose her.';

function App() {
  const [activeScene, setActiveScene] = useState('first-frame');
  const [progress, setProgress] = useState(0);
  const [passage, setPassage] = useState(() => {
    try {
      return window.localStorage.getItem('sara-himeji-provisional-passage') ?? provisionalPassage;
    } catch {
      return provisionalPassage;
    }
  });

  useEffect(() => {
    document.title = 'SARA HIMEJI';
    const nodes = scenes
      .map(({ id }) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    const updateActiveScene = () => {
      if (!nodes.length) return;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY <= 1) {
        setActiveScene(scenes[0].id);
        return;
      }
      if (maxScroll > 0 && window.scrollY >= maxScroll - 1) {
        setActiveScene(scenes[scenes.length - 1].id);
        return;
      }

      const focusLine = window.innerHeight / 2;
      const sceneAtFocus = nodes.find((node) => {
        const bounds = node.getBoundingClientRect();
        return bounds.top <= focusLine && bounds.bottom > focusLine;
      });
      if (sceneAtFocus) {
        setActiveScene(sceneAtFocus.id);
        return;
      }

      let nearestScene: HTMLElement | undefined;
      let nearestDistance = Number.POSITIVE_INFINITY;
      nodes.forEach((node) => {
        const bounds = node.getBoundingClientRect();
        const distance =
          focusLine < bounds.top
            ? bounds.top - focusLine
            : focusLine - bounds.bottom;
        if (distance < nearestDistance) {
          nearestScene = node;
          nearestDistance = distance;
        }
      });
      if (nearestScene) setActiveScene(nearestScene.id);
    };

    let observer: IntersectionObserver | undefined;
    const observeScenes = () => {
      observer?.disconnect();
      const focusLine = Math.floor(window.innerHeight / 2);
      const bottomMargin = Math.max(0, window.innerHeight - focusLine - 1);
      observer = new IntersectionObserver(updateActiveScene, {
        rootMargin: `-${focusLine}px 0px -${bottomMargin}px 0px`,
        threshold: 0,
      });
      nodes.forEach((node) => observer?.observe(node));
      updateActiveScene();
    };
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
    };
    const handleResize = () => {
      updateProgress();
      observeScenes();
    };

    observeScenes();
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('sara-himeji-provisional-passage', passage);
    } catch {
      // Editing remains available for this visit when local storage is unavailable.
    }
  }, [passage]);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('.reveal');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );
    targets.forEach((target) => revealObserver.observe(target));
    return () => revealObserver.disconnect();
  }, []);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="progress-track" aria-hidden="true">
        <div
          className="progress-fill"
          data-testid="progress-reading"
          style={{ width: `${progress}%` }}
        />
      </div>
      <header className="topbar">
        <a
          className="wordmark"
          href="#first-frame"
          aria-label="SARA HIMEJI, beginning"
          data-testid="link-wordmark-home"
        >
          SARA HIMEJI
        </a>
        <nav className="scene-nav" aria-label="Scenes">
          {scenes.map(({ id, nav, label }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-label={`Scene ${nav}: ${label}`}
              aria-current={activeScene === id ? 'location' : undefined}
              className={activeScene === id ? 'active' : ''}
              data-testid={`link-scene-${id}`}
            >
              {nav}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section className="scene hero" id="first-frame" aria-labelledby="hero-title">
          <div className="hero-content">
            <div className="scene-number reveal" data-motion="left">SCENE 01 / THE FIRST FRAME</div>
            <h1 className="hero-title reveal delay-1" id="hero-title">SARA<br />HIMEJI</h1>
            <p className="hero-jp reveal delay-2" lang="ja">姫路 紗良</p>
            <p className="hero-note reveal delay-3">A CHARACTER STUDY<br />IN SIX SCENES</p>
          </div>
          <a className="scroll-cue" href="#about-sara" data-testid="link-continue-story">
            CONTINUE INTO HER STORY
          </a>
        </section>

        <section className="scene intro" id="about-sara" aria-labelledby="about-title">
          <div className="scene-number reveal" data-motion="left">SCENE 02 / HER INTRODUCTION</div>
          <div className="intro-grid">
            <aside className="intro-aside reveal" data-motion="scale">
              <p className="vertical-mark" lang="ja">姫路 紗良</p>
              <p>First impressions are only a beginning. Here is the ground beneath them.</p>
            </aside>
            <div className="intro-copy">
              <h2 className="section-heading serif reveal" id="about-title">About Sara</h2>
              <p className="lead reveal delay-1">An honor student with an easy warmth—and a story that asks us to look a little closer.</p>
              <p className="reveal delay-2">
                Sara Himeji is a first-year student at Minegahara High School. She attends the cram school where an instructor works part-time. Her official profile describes her as friendly, with an effortless ability to befriend people. There is something sweet and endearing in that easy closeness; it makes her brightness feel both charming and distinctly her own.
              </p>
              <p className="reveal delay-2">
                When a previous instructor leaves, Sara takes an interest in the instructor who remains. That shift is the starting point of her place in <em>Rascal Does Not Dream of Santa Claus</em>: a student whose brightness sits beside a more private uncertainty.
              </p>
              <p className="reveal delay-3">
                A later episode adds a spoiler-sensitive layer: the official synopsis links her Puberty Syndrome to heartbreak and anxiety, and says she does not want it fixed. That plot detail complicates her first impression without serving as a complete explanation of who she is.
              </p>
              <div className="fact-line reveal delay-3" aria-label="Verified profile details">
                <div className="fact">
                  <span className="fact-label">Height</span>
                  <span className="fact-value">154 cm</span>
                </div>
                <div className="fact">
                  <span className="fact-label">Birthday</span>
                  <span className="fact-value">June 6</span>
                </div>
                <div className="fact">
                  <span className="fact-label">School year</span>
                  <span className="fact-value">First year</span>
                </div>
              </div>
              <p className="annotation reveal delay-3">Profile facts: official character profile. Episode context includes a light spoiler.</p>
            </div>
          </div>
        </section>

        <section className="scene deep" id="beyond-surface" aria-labelledby="deep-title">
          <div className="deep-head">
            <div className="scene-number reveal" data-motion="left">SCENE 03 / BEYOND THE SURFACE</div>
            <h2 className="deep-title serif reveal delay-1" id="deep-title">
              The brightness<br />is <em>not</em> the whole story.
            </h2>
          </div>
          <div className="deep-rail">
            <article className="deep-entry reveal" data-motion="left">
              <span className="entry-index">01 — WHAT IS ESTABLISHED</span>
              <h3>A sociable first impression</h3>
              <p>
                The profile gives us a concise but telling contrast: Sara is academically accomplished, and also naturally approachable. Her friendliness is not presented as a performance; it is part of how she moves through the people around her.
              </p>
              <span className="interpretation">Reading / interpretation</span>
            </article>
            <article className="deep-entry reveal" data-motion="left">
              <span className="entry-index">02 — A CREATOR’S VIEW</span>
              <h3>Confidence, still in progress</h3>
              <p>
                In a production interview, the director describes Sara as someone without much confidence who is searching for it. He also speaks of a small-devil quality, cuteness, and expressive eyes. This is an attributed creative interpretation—not a list of objective canon traits.
              </p>
              <span className="interpretation">Attributed interpretation / production interview</span>
            </article>
            <article className="deep-entry reveal" data-motion="left">
              <span className="entry-index">03 — EPISODE 9 / SPOILER-SENSITIVE</span>
              <h3>A symptom with emotional context</h3>
              <p>
                The official episode synopsis establishes that Sara experiences Puberty Syndrome and does not want it fixed. It frames the symptoms as easing her anxiety after heartbreak and making her popular with boys. The synopsis gives that premise a specific emotional context; there is no need to make it more sensational than that.
              </p>
              <span className="interpretation">Established episode information</span>
            </article>
          </div>
        </section>

        <section className="scene details" id="the-details" aria-labelledby="details-title">
          <div className="details-inner">
            <div className="scene-number reveal" data-motion="left">SCENE 04 / THE DETAILS</div>
            <h2 className="details-title serif reveal delay-1" id="details-title">Notice what<br />the words <em>don’t</em> flatten.</h2>
            <article className="detail-stage reveal" data-motion="scale">
              <div className="detail-mark" aria-hidden="true"><span>154</span></div>
              <div className="detail-copy">
                <span className="eyebrow">01 / A PERSON, NOT A PROFILE</span>
                <h3>A measured detail</h3>
                <p>Her profile records a height of 154 cm. A number is precise; a character is never only a number. Here it is a quiet anchor among the larger, less measurable parts of the portrait.</p>
              </div>
            </article>
            <article className="detail-stage reveal" data-motion="left">
              <div className="detail-mark vertical" aria-hidden="true"><span lang="ja">紗良</span></div>
              <div className="detail-copy">
                <span className="eyebrow">02 / THE NAME IN THE FRAME</span>
                <h3>Room around the name</h3>
                <p>姫路 紗良. Set apart from an image, her name can hold the frame on its own. The restraint is deliberate: no substitute portrait, only room to pay attention.</p>
              </div>
            </article>
            <article className="detail-stage reveal" data-motion="scale">
              <figure className="detail-mark portrait-mark">
                <img
                  className="sara-portrait"
                  src="https://rascaldoesnotdream.com/santaclaus/assets/img/character/character_img10_sara.png"
                  alt="Sara Himeji in her Minegahara High School uniform, shown alone."
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="portrait-credit">
                  Official character image ·{' '}
                  <a href="https://rascaldoesnotdream.com/santaclaus/" target="_blank" rel="noreferrer">
                    source
                  </a>
                </figcaption>
              </figure>
              <div className="detail-copy">
                <span className="eyebrow">03 / AN EXPRESSION, NOT A CODE</span>
                <h3>Expressive eyes</h3>
                <p>The production interview notes that her eyes were a deliberate part of the performance. That small-devil charm can feel cute; the reading is attributed to the creators, not treated as a hidden meaning.</p>
              </div>
            </article>
            <article className="detail-stage reveal" data-motion="scale">
              <div className="detail-mark" aria-hidden="true"><span className="serif">06·06</span></div>
              <div className="detail-copy">
                <span className="eyebrow">04 / A DATE, NOT A SYMBOL</span>
                <h3>June, twice in the margin</h3>
                <p>June 6 is the birthday listed on her official profile. This composition gives that fact a little space—not a hidden meaning, just a small detail worth remembering.</p>
              </div>
            </article>
            <p className="annotation details-note">One official Sara portrait; all other visual compositions remain typographic and CSS-led.</p>
          </div>
        </section>

        <section className="scene why" id="why-sara" aria-labelledby="why-title">
          <div className="why-inner">
            <div className="scene-number reveal" data-motion="left">SCENE 05 / WHY SARA</div>
            <h2 className="why-title serif reveal delay-1" id="why-title">A reason,<br />still becoming.</h2>
            <div className="reveal delay-2">
              <label className="editable-label" htmlFor="creator-passage">Provisional creator-perspective passage · editable</label>
              <textarea
                className="editable-passage"
                id="creator-passage"
                data-testid="input-creator-passage"
                value={passage}
                onChange={(event) => setPassage(event.target.value)}
                aria-describedby="passage-note"
              />
              <p className="edit-note" id="passage-note">
                Placeholder only—not a confirmed account of the creator’s feelings. Edit freely; this text is saved in this browser.
              </p>
            </div>
          </div>
        </section>

        <section className="scene ending" id="last-frame" aria-labelledby="ending-title">
          <div className="ending-main">
            <div className="scene-number reveal" data-motion="left">SCENE 06 / THE LAST FRAME</div>
            <h2 className="ending-title reveal delay-1" id="ending-title">SARA<br />HIMEJI</h2>
            <p className="ending-jp reveal delay-2" lang="ja">姫路 紗良</p>
            <p className="closing serif reveal delay-3">Some things stay with us because they leave room to keep looking.</p>
            <a className="return-link reveal" href="#first-frame" data-testid="link-return-first-frame">
              Return to the first frame <span aria-hidden="true">&nbsp;↗</span>
            </a>
          </div>
          <footer className="site-footer">
            <p className="disclaimer">
              This is an unofficial fan-made project and is not affiliated with Aniplex, KADOKAWA, or the series’ production committee. Sara’s solo portrait is served directly from her official character profile and linked to its source; this site does not host a copied image file. All other visual compositions are typographic and CSS-led.
            </p>
            <nav className="sources" aria-label="Sources">
              <a href="https://rascaldoesnotdream.com/santaclaus/" target="_blank" rel="noreferrer" data-testid="link-source-profile">Official character profile</a>
              <a href="https://rascaldoesnotdream.com/santaclaus/story/?id=9" target="_blank" rel="noreferrer" data-testid="link-source-episode">Official episode synopsis</a>
              <a href="https://ao-buta.com/santa/special/interview/my_student.html" target="_blank" rel="noreferrer" data-testid="link-source-interview">Production interview</a>
              <a href="https://www.aniplex.co.jp/lineup/ao-buta-santa/" target="_blank" rel="noreferrer" data-testid="link-source-program">Program page</a>
            </nav>
          </footer>
        </section>
      </main>
    </>
  );
}

export default App;
