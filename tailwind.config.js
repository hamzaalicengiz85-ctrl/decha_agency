/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      // Renkler CSS değişkenlerinden okunur. Sayfa ve CRT ekranı farklı
      // token setleri taşır; .screen-phosphor içindeki her bileşen
      // otomatik olarak koyu ekran renklerine geçer.
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        'bg-soft': 'rgb(var(--c-bg-soft) / <alpha-value>)',
        'bg-elev': 'rgb(var(--c-bg-elev) / <alpha-value>)',
        fg: 'rgb(var(--c-fg) / <alpha-value>)',
        'fg-muted': 'rgb(var(--c-fg-muted) / <alpha-value>)',
        'fg-subtle': 'rgb(var(--c-fg-subtle) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        // accent = dolgu (ham TVA turuncusu), accent-ink = metin için güvenli türev
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        'accent-ink': 'rgb(var(--c-accent-ink) / <alpha-value>)',
        'accent-fg': 'rgb(var(--c-accent-fg) / <alpha-value>)',
        highlight: 'rgb(var(--c-highlight) / <alpha-value>)',
        'highlight-fg': 'rgb(var(--c-highlight-fg) / <alpha-value>)',
        danger: 'rgb(var(--c-danger) / <alpha-value>)',
        'danger-fill': 'rgb(var(--c-danger-fill) / <alpha-value>)',
        'danger-fg': 'rgb(var(--c-danger-fg) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Archivo', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Chakra Petch"', 'Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      // TEK TİPOGRAFİ ÖLÇEĞİ
      // Denetimde sitede 19 farklı punto sayıldı (9px'e kadar inen, 0.5px
      // farklarla çoğalan değerler). Serbest `text-[10.5px]` yazımı yerine
      // yedi adımlı bir ölçek: her adımın bir işi var, taban 11px.
      // 9-10px'lik yazı retro his için değil, okunmadığı için sorundu.
      fontSize: {
        label: ['11px', { lineHeight: '1.45' }], // mono büyük harf etiketler
        meta: ['12px', { lineHeight: '1.5' }], // ikincil veri: tarih, fiyat, künye
        caption: ['13px', { lineHeight: '1.55' }], // kart açıklaması, form yardımı
        body: ['15px', { lineHeight: '1.65' }], // paragraf
        lead: ['17px', { lineHeight: '1.6' }], // giriş paragrafı
        title: ['20px', { lineHeight: '1.3' }], // kart başlığı
        subhead: ['26px', { lineHeight: '1.22' }], // ara başlık
        stat: ['30px', { lineHeight: '1.05' }], // büyük rakam (sayaç, adım no)
        headline: ['clamp(1.6rem, 2.7vw, 2.3rem)', { lineHeight: '1.12', letterSpacing: '0.005em' }],
        display: ['clamp(2.2rem, 4.4vw, 3.6rem)', { lineHeight: '1.04', letterSpacing: '0.005em' }],
      },

      // Harf aralığı da 26 farklı değere dağılmıştı. Dört rol kaldı.
      letterSpacing: {
        micro: '0.02em', // cümle düzenindeki başlıklar
        data: '0.08em', // rakam ve kod dizileri
        label: '0.14em', // mono büyük harf etiketler
        eyebrow: '0.22em', // bölüm kodu / üst etiket
      },
      borderRadius: {
        // Retro donanım: yumuşak yuvarlaklar yerine sert, küçük kavisler
        DEFAULT: '3px',
        md: '4px',
        lg: '5px',
        xl: '6px',
        '2xl': '8px',
        '3xl': '12px',
      },
      transitionTimingFunction: {
        // Ortak hareket eğrileri (index.css'teki belirteçlerle aynı)
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0.15' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        marquee: 'marquee 42s linear infinite',
        blink: 'blink 1.4s steps(1, end) infinite',
      },
    },
  },
  plugins: [],
}
