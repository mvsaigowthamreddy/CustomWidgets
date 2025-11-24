(function () {
  class DonutGauge extends HTMLElement {
    constructor() {
      super();
      this._root = this.attachShadow({ mode: "open" });
      this._value = 50;
      this._target = 100;

      this._root.innerHTML = `
        <style>
          .wrap {
            width: 100%; height: 100%;
            display: flex; align-items: center; justify-content: center;
          }
          .gauge {
            width: 120px; height: 120px;
            border-radius: 50%;
            background: conic-gradient(#4caf50 var(--p), #ddd 0);
            display:flex; align-items:center; justify-content:center;
            font-size: 22px; font-weight:bold;
          }
        </style>
        <div class="wrap">
          <div class="gauge"><span id="txt"></span></div>
        </div>
      `;
    }

    onCustomWidgetAfterUpdate(changedProps) {
      if (changedProps.value !== undefined) this._value = changedProps.value;
      if (changedProps.target !== undefined) this._target = changedProps.target;
      this._update();
    }

    _update() {
      const percent = Math.round((this._value / this._target) * 100);
      this._root.querySelector(".gauge").style.setProperty("--p", percent + "%");
      this._root.querySelector("#txt").textContent = percent + "%";
    }
  }

  customElements.define("com-simple-donut-gauge", DonutGauge);
})();
