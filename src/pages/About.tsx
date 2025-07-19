export default function About() {
  return (
    <div className="bg-[#fbf1c7] p-8 border-4 border-[#3c3836] shadow-[4px_4px_0_0_#3c3836] text-[#3c3836] space-y-6">
      <h1 className="text-3xl font-extrabold uppercase">About Kawihlogy</h1>

      <section className="space-y-2">
        <h2 className="text-xl font-bold uppercase">What is Kawihlogy?</h2>
        <p className="text-base leading-relaxed">
          Kawihlogy is a minimalist journaling web application designed for
          clarity, expression, and thematic exploration. Users can log their
          thoughts, emotions, and ideas with topic tagging and emotion labeling.
          Each journal entry can be transformed into a generated poem, and the
          resulting poem can be converted into audio—allowing users to listen to
          their written reflections. It blends personal reflection with
          lightweight social visibility.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold uppercase">Core Features</h2>
        <ul className="list-disc list-inside text-base space-y-1">
          <li>Create, view, and edit personal journal entries</li>
          <li>
            Tag entries with <span className="font-bold">topics</span> and{" "}
            <span className="font-bold">emotions</span>
          </li>
          <li>Generate poems from journal entries</li>
          <li>Listen to audio generated from poems</li>
          <li>Toggle privacy between public and private</li>
          <li>Browse other users' public journals</li>
          <li>Pagination and metadata for entry browsing</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold uppercase">Design Philosophy</h2>
        <p className="text-base leading-relaxed">
          Inspired by Gruvbox aesthetics and UNIX minimalism. The UI emphasizes
          typography, contrast, and semantic clarity. No distractions. Just
          journaling.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold uppercase">Built With</h2>
        <ul className="list-disc list-inside text-base space-y-1">
          <li>React + Vite</li>
          <li>Tailwind CSS</li>
          <li>React Router</li>
          <li>Custom Auth + API integration</li>
          <li>NestJS (Backend)</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold uppercase">Credits</h2>
        <p className="text-base leading-relaxed">
          Created by Me. Fonts, colors, and components inspired by the Gruvbox
          color scheme and open-source design principles.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold uppercase">Open Source & Contact</h2>
        <p className="text-sm leading-relaxed">
          Kawihlogy is an open source project. You can explore the source code,
          report issues, or contribute via GitHub. For feedback or inquiries,
          feel free to reach out.
        </p>
        <ul className="text-sm list-disc list-inside space-y-1">
          <li>
            Frontend:{" "}
            <a
              href="https://github.com/reimiii/kawihlogy-ui"
              className="underline text-[#458588] font-bold"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/reimiii/kawihlogy-ui
            </a>
          </li>
          <li>
            Backend:{" "}
            <a
              href="https://github.com/reimiii/kawihlogy"
              className="underline text-[#458588] font-bold"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/reimiii/kawihlogy
            </a>
          </li>
          <li>
            Contact:{" "}
            <a
              href="mailto:imiia75775@gmai.com"
              className="underline text-[#458588] font-bold"
            >
              imiia75775@gmail.com
            </a>
          </li>
          <li>
            Linkedin:{" "}
            <a
              href="https://www.linkedin.com/in/hilmi-akbar-muharrom/"
              className="underline text-[#458588] font-bold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hilmi Akbar Muharrom
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
