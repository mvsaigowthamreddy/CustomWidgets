// gauge.js - minimal web component for SAC
class DonutGauge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:'open'});
    // initial DOM
    this.shadowRoot.innerHTML = `
      <style>
        .wrap { font-family: Arial, Helvetica, sans-serif; width: 180px; text-align:center; }
        svg { width: 140px; height: 140px; display:block; margin: 0 auto; }
        .label { margin-top:8px; font-size:14px; }
        .number { font-size:22px; font-weight:700; }
      </style>
      <div class="wrap">
        <svg viewBox="0 0 42 42" class="donut">
          <circle class="donut-ring" cx="21" cy="21" r="15.9155" fill="transparent" stroke="#eee" stroke-width="4"></circle>
          <circle class="donut-segment" cx="21" cy="21" r="15.9155" fill="transparent" stroke="#3b82f6" stroke-width="4" stroke-linecap="round" stroke-dasharray="0 100"></circle>
        </svg>
        <div class="label"><div class="number">0%</div><div class="title"></div></div>
      </div>
    `;
    this._value = 0;
    this._target = 100;
  }

  // lifecycle called by SAC when properties are applied/updated
  onCustomWidgetBeforeUpdate(changedProperties) {
    // SAC will pass changedProperties; we'll read from attributes instead
    // (If SAC uses a different API object, adapt using official guide)
  }

  onCustomWidgetAfterUpdate() {
    // Read properties exposed in the JSON descriptor from attributes (SAC injects them)
    // safe-guard: read either attributes or properties
    const valAttr = this.getAttribute('value');
    const targAttr = this.getAttribute('target');
    const titleAttr = this.getAttribute('title');
    this._value = valAttr !== null ? Number(valAttr) : this._value;
    this._target = targAttr !== null ? Number(targAttr) : this._target;
    this.shadowRoot.querySelector('.title').textContent = titleAttr || 'KPI';
    this._render();
  }

  connectedCallback() {
    // initial render
    this.onCustomWidgetAfterUpdate();
  }

  _render() {
    const pct = Math.min(100, Math.round((this._value / this._target) * 100));
    const seg = this.shadowRoot.querySelector('.donut-segment');
    const numberEl = this.shadowRoot.querySelector('.number');
    // set stroke-dasharray to animate segment (SVG dasharray uses percentage of circumference).
    // The second number is remainder so it displays correctly.
    seg.setAttribute('stroke-dasharray', `${pct} ${100 - pct}`);
    // animate using a small transition
    seg.style.transition = 'stroke-dasharray 700ms ease';
    numberEl.textContent = `${pct}%`;
  }
}

customElements.define('donut-gauge', DonutGauge);

// For SAC: the webcomponent tag must match the component name used in the widget JS resource.
// The JSON resource (resources.webcomponent) should correctly load this file.
