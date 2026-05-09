import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Settings, Code, Printer, Download, RefreshCw, 
  AlertCircle, Maximize2, Layers, Info, Save, 
  ChevronDown, Ruler, Zap, BookOpen, X, Share2, Check, HelpCircle
} from 'lucide-react';

// Custom Premium Logo Component
const ZPLLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M19 8H5C3.34315 8 2 9.34315 2 11V17C2 18.6569 3.34315 20 5 20H19C20.6569 20 22 18.6569 22 17V11C22 9.34315 20.6569 8 19 8Z" fill="currentColor" />
    <path d="M17 14H7V22H17V14Z" fill="#fff" fillOpacity="0.9" />
    <path d="M6 2H18V8H6V2Z" fill="currentColor" fillOpacity="0.4" />
    <rect x="9" y="16" width="6" height="1" rx="0.5" fill="currentColor" fillOpacity="0.2" />
    <rect x="9" y="18" width="4" height="1" rx="0.5" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

// The securely wrapped ZPL guide HTML payload
const GUIDE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
:root {
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary: #94a3b8;
  --color-border: #e2e8f0;
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-hover: #f1f5f9;
  --odoo-plum: #714B67;
  --odoo-teal: #017E84;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
* { box-sizing: border-box; }
body { margin: 0; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--color-bg-primary); -webkit-font-smoothing: antialiased; }
.container { padding: 2rem; max-width: 1000px; margin: 0 auto; color: var(--color-text-primary); }

/* Premium Tabs (Segmented Control) */
.tabs { display: inline-flex; gap: 4px; margin-bottom: 32px; background: var(--color-bg-secondary); padding: 6px; border-radius: var(--radius-md); border: 1px solid var(--color-border); box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
.tab { padding: 8px 20px; border: none; border-radius: var(--radius-sm); background: transparent; color: var(--color-text-secondary); cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
.tab:hover { color: var(--color-text-primary); }
.tab.active { background: var(--color-bg-primary); color: var(--odoo-plum); box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06); }

/* Layout */
.lesson { display: none; animation: fadeIn 0.4s ease; }
.lesson.active { display: block; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }

/* Canvas Area */
.label-canvas { background: #e2e8f0; padding: 24px; display: flex; justify-content: center; align-items: center; border-radius: var(--radius-lg); box-shadow: inset 0 2px 10px rgba(0,0,0,0.05); position: relative; }
.label-canvas svg { background: white; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1); border-radius: 4px; width: 100%; height: 100%; max-width: 400px; max-height: 260px; display: block; }

/* Typography */
.section-title { font-size: 15px; font-weight: 700; color: var(--color-text-primary); margin: 0 0 16px; letter-spacing: -0.01em; display: flex; align-items: center; gap: 8px; }
.desc { font-size: 14px; color: var(--color-text-secondary); margin-bottom: 24px; line-height: 1.6; }

/* Code Areas */
.mac-window { background: #0f172a; border-radius: var(--radius-md); overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15); margin-bottom: 16px; }
.mac-header { background: #1e293b; padding: 10px 16px; display: flex; gap: 6px; border-bottom: 1px solid #334155; }
.mac-dot { width: 10px; height: 10px; border-radius: 50%; }
.mac-dot.r { background: #ef4444; }
.mac-dot.y { background: #eab308; }
.mac-dot.g { background: #22c55e; }
.code-area { font-family: var(--font-mono); font-size: 13px; color: #e2e8f0; padding: 20px; line-height: 1.6; overflow-x: auto; white-space: pre-wrap; }
.live-zpl { background: var(--color-bg-primary); color: var(--color-text-secondary); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 16px; font-family: var(--font-mono); font-size: 12px; line-height: 1.7; word-break: break-all; margin-top: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.cmd { color: #f472b6; font-weight: 600; }
.val { color: #38bdf8; }
.comment { color: #64748b; font-style: italic; }

/* Custom Inputs */
.controls { display: flex; flex-direction: column; gap: 16px; background: var(--color-bg-secondary); padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--color-border); }
.control-row { display: flex; align-items: center; gap: 16px; }
.control-row label { font-size: 13px; font-weight: 600; color: var(--color-text-secondary); width: 85px; flex-shrink: 0; }
.control-row span { font-size: 12px; font-weight: 600; font-family: var(--font-mono); color: var(--odoo-plum); min-width: 40px; text-align: center; background: white; padding: 4px 8px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
input[type=text], select { flex: 1; font-size: 14px; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); background: var(--color-bg-primary); color: var(--color-text-primary); transition: all 0.2s; outline: none; font-weight: 500; }
input[type=text]:focus, select:focus { border-color: var(--odoo-plum); box-shadow: 0 0 0 3px rgba(113, 75, 103, 0.15); }

/* Range Slider Styling */
input[type=range] { -webkit-appearance: none; width: 100%; background: transparent; }
input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 18px; width: 18px; border-radius: 50%; background: var(--odoo-plum); cursor: pointer; margin-top: -7px; box-shadow: 0 2px 5px rgba(113, 75, 103, 0.4); border: 2px solid white; transition: transform 0.1s; }
input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.1); }
input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 4px; cursor: pointer; background: #cbd5e1; border-radius: 2px; }
input[type=range]:focus::-webkit-slider-runnable-track { background: #94a3b8; }

/* Tooltips/Tips */
.tip { background: #f8fafc; border: 1px solid var(--color-border); border-left: 4px solid var(--odoo-plum); border-radius: var(--radius-md); padding: 16px 20px; font-size: 14px; color: var(--color-text-secondary); margin-top: 16px; line-height: 1.6; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.tip strong { color: var(--color-text-primary); font-weight: 700; }
.tip.pro { background: #f0fdf4; border-color: #bbf7d0; border-left-color: #22c55e; color: #166534; }
.tip.pro strong { color: #14532d; }

/* Table */
.cmd-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 14px; border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
.cmd-table th { text-align: left; font-weight: 600; padding: 16px; background: var(--color-bg-secondary); border-bottom: 1px solid var(--color-border); color: var(--color-text-primary); text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em; }
.cmd-table td { padding: 16px; border-bottom: 1px solid var(--color-border); color: var(--color-text-secondary); line-height: 1.5; }
.cmd-table tr:last-child td { border-bottom: none; }
.cmd-table tr:hover td { background: var(--color-bg-hover); }
.mono { font-family: var(--font-mono); font-size: 13px; color: var(--odoo-plum); font-weight: 600; background: var(--color-bg-secondary); padding: 4px 8px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
</style>
</head>
<body>
<div class="container">
  <div class="tabs">
    <button class="tab active" onclick="showLesson('basics')">1. Structure</button>
    <button class="tab" onclick="showLesson('text')">2. Text & Fonts</button>
    <button class="tab" onclick="showLesson('barcode')">3. Barcodes</button>
    <button class="tab" onclick="showLesson('cheatsheet')">4. Cheat Sheet</button>
  </div>

  <!-- LESSON 1: STRUCTURE -->
  <div class="lesson active" id="lesson-basics">
    <div class="two-col">
      <div>
        <p class="section-title">Every ZPL label has this skeleton</p>
        <div class="mac-window">
          <div class="mac-header"><div class="mac-dot r"></div><div class="mac-dot y"></div><div class="mac-dot g"></div></div>
          <div class="code-area"><span class="cmd">^XA</span>          <span class="comment">← Start label</span>

  <span class="comment">← Your commands go here</span>

<span class="cmd">^XZ</span>          <span class="comment">← End label</span></div>
        </div>
        <div class="tip"><strong>Key rule:</strong> Commands always start with <code>^</code> or <code>~</code>. Parameters follow immediately with no spaces. Order matters — ZPL reads top to bottom, left to right.</div>

        <p class="section-title" style="margin-top:24px">A complete minimal label</p>
        <div class="mac-window">
          <div class="mac-header"><div class="mac-dot r"></div><div class="mac-dot y"></div><div class="mac-dot g"></div></div>
          <div class="code-area"><span class="cmd">^XA</span>
<span class="cmd">^FO</span><span class="val">50,50</span>   <span class="comment">← position: x=50, y=50</span>
<span class="cmd">^A0N</span><span class="val">,30,30</span>  <span class="comment">← font 0, 30×30 dots</span>
<span class="cmd">^FD</span><span class="val">Hello!</span><span class="cmd">^FS</span>  <span class="comment">← text data + close</span>
<span class="cmd">^XZ</span></div>
        </div>

        <div class="tip"><strong>Dots vs mm:</strong> Zebra printers measure in dots. At 203 dpi (common), 1mm ≈ 8 dots. At 300 dpi, 1mm ≈ 12 dots.</div>
      </div>
      <div>
        <p class="section-title">Label preview (4" × 2")</p>
        <div class="label-canvas">
          <svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="260" fill="#fff"/>
            <rect x="50" y="40" width="1" height="1" fill="transparent"/>
            <text x="50" y="75" font-family="monospace" font-size="26" fill="#0f172a" font-weight="bold">Hello!</text>
            <text x="50" y="210" font-family="monospace" font-size="12" fill="#94a3b8">^FO50,50 → x=50, y=50 dots</text>
            <line x1="0" y1="50" x2="60" y2="50" stroke="#714B67" stroke-width="1" stroke-dasharray="4 4"/>
            <line x1="50" y1="0" x2="50" y2="60" stroke="#714B67" stroke-width="1" stroke-dasharray="4 4"/>
            <circle cx="50" cy="50" r="4" fill="#714B67"/>
            <text x="58" y="46" font-size="11" fill="#714B67" font-weight="bold" font-family="monospace">x=50</text>
            <text x="8" y="46" font-size="11" fill="#714B67" font-weight="bold" font-family="monospace">y=50</text>
          </svg>
        </div>
        <div class="tip" style="margin-top:16px"><strong>Origin (0,0)</strong> is always the <em>top-left</em> corner of the label. X increases right, Y increases down.</div>
        <div class="tip pro" style="margin-top:16px;">
          <strong>Pro Tip:</strong> Missing <code>^XA</code> or <code>^XZ</code> is the #1 reason a label fails to print. The printer simply ignores everything outside these two commands!
        </div>
      </div>
    </div>
  </div>

  <!-- LESSON 2: TEXT -->
  <div class="lesson" id="lesson-text">
    <p class="desc">Use the interactive controls to build a text field and watch the generated ZPL code update in real-time.</p>
    <div class="two-col">
      <div class="controls">
        <div class="control-row">
          <label>Text</label>
          <input type="text" id="txt-content" value="Sample Label" oninput="updateText()">
        </div>
        <div class="control-row">
          <label>X position</label>
          <input type="range" min="10" max="300" value="40" id="txt-x" oninput="updateText()">
          <span id="txt-x-val">40</span>
        </div>
        <div class="control-row">
          <label>Y position</label>
          <input type="range" min="10" max="220" value="60" id="txt-y" oninput="updateText()">
          <span id="txt-y-val">60</span>
        </div>
        <div class="control-row">
          <label>Font size</label>
          <input type="range" min="10" max="80" value="32" id="txt-size" oninput="updateText()">
          <span id="txt-size-val">32</span>
        </div>
        <div class="control-row">
          <label>Alignment</label>
          <select id="txt-align" onchange="updateText()">
            <option value="L">L — Left</option>
            <option value="C">C — Center</option>
            <option value="R">R — Right</option>
          </select>
        </div>
        <div class="control-row">
          <label>Orientation</label>
          <select id="txt-orient" onchange="updateText()">
            <option value="N">N — Normal</option>
            <option value="R">R — Rotate 90°</option>
            <option value="I">I — Inverted</option>
            <option value="B">B — Bottom-up</option>
          </select>
        </div>
        <div class="live-zpl" id="text-zpl"></div>
      </div>
      <div>
        <div class="label-canvas">
          <svg id="text-preview" viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="260" fill="#fff"/>
          </svg>
        </div>
        <div class="tip" style="margin-top:16px">
          <strong>^A0N,h,w</strong> — font 0 (built-in), N=normal, h=height dots, w=width dots.<br><br>
          <strong>^FO x,y</strong> — sets where the field starts.<br><br>
          <strong>^FB w,l,s,a</strong> — Field Block for wrapping and alignment.<br><br>
          <strong>^FD…^FS</strong> — wraps your text content.
        </div>
      </div>
    </div>
  </div>

  <!-- LESSON 3: BARCODES -->
  <div class="lesson" id="lesson-barcode">
    <p class="desc">Adjust the barcode parameters to see how ZPL handles different symbologies and scaling.</p>
    <div class="two-col">
      <div class="controls">
        <div class="control-row">
          <label>Data</label>
          <input type="text" id="bc-data" value="123456789" oninput="updateBarcode()">
        </div>
        <div class="control-row">
          <label>Type</label>
          <select id="bc-type" onchange="updateBarcode()">
            <option value="BC">^BC — Code 128</option>
            <option value="BE">^BE — EAN-13</option>
            <option value="BQ">^BQ — QR Code</option>
          </select>
        </div>
        <div class="control-row">
          <label>Height</label>
          <input type="range" min="30" max="160" value="80" id="bc-height" oninput="updateBarcode()">
          <span id="bc-height-val">80</span>
        </div>
        <div class="control-row">
          <label>X pos</label>
          <input type="range" min="10" max="250" value="40" id="bc-x" oninput="updateBarcode()">
          <span id="bc-x-val">40</span>
        </div>
        <div class="control-row">
          <label>Y pos</label>
          <input type="range" min="10" max="220" value="30" id="bc-y" oninput="updateBarcode()">
          <span id="bc-y-val">30</span>
        </div>
        <div class="live-zpl" id="bc-zpl"></div>
      </div>
      <div>
        <div class="label-canvas" id="bc-canvas">
          <svg id="bc-preview" viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="260" fill="#fff"/>
          </svg>
        </div>
        <div class="tip" style="margin-top:16px">
          <strong>Common barcodes in ZPL:</strong><br><br>
          <span class="mono">^BC</span> Code 128 (general purpose)<br>
          <span class="mono">^BE</span> EAN-13 (retail)<br>
          <span class="mono">^BQ</span> QR Code (2D)<br>
          <span class="mono">^B3</span> Code 39<br><br>
          <strong>^BY w,r,h</strong> sets default bar width, ratio, and height — place it <em>before</em> the barcode command.
        </div>
      </div>
    </div>
  </div>

  <!-- LESSON 4: CHEAT SHEET -->
  <div class="lesson" id="lesson-cheatsheet">
    <table class="cmd-table">
      <thead><tr><th>Command</th><th>Name</th><th>Syntax / Example</th><th>Purpose</th></tr></thead>
      <tbody>
        <tr><td class="mono">^XA / ^XZ</td><td>Label start/end</td><td class="mono" style="background:transparent;border:none;">^XA … ^XZ</td><td>Wraps every label</td></tr>
        <tr><td class="mono">^FO</td><td>Field Origin</td><td class="mono" style="background:transparent;border:none;">^FO x,y</td><td>Position of next field</td></tr>
        <tr><td class="mono">^FD … ^FS</td><td>Field Data</td><td class="mono" style="background:transparent;border:none;">^FDHello^FS</td><td>Text content of a field</td></tr>
        <tr><td class="mono">^A</td><td>Font</td><td class="mono" style="background:transparent;border:none;">^A0N,h,w</td><td>Built-in font, orientation, size</td></tr>
        <tr><td class="mono">^CF</td><td>Default font</td><td class="mono" style="background:transparent;border:none;">^CF0,24</td><td>Set default font for whole label</td></tr>
        <tr><td class="mono">^BY</td><td>Bar default</td><td class="mono" style="background:transparent;border:none;">^BY 2,3,80</td><td>Bar width, ratio, height</td></tr>
        <tr><td class="mono">^BC</td><td>Code 128</td><td class="mono" style="background:transparent;border:none;">^BCN,80,Y,N</td><td>Most common linear barcode</td></tr>
        <tr><td class="mono">^BQ</td><td>QR Code</td><td class="mono" style="background:transparent;border:none;">^BQN,2,5^FD…</td><td>2D QR barcode</td></tr>
        <tr><td class="mono">^GB</td><td>Graphic Box</td><td class="mono" style="background:transparent;border:none;">^GB w,h,t,c,r</td><td>Rectangle or line</td></tr>
        <tr><td class="mono">^GC</td><td>Graphic Circle</td><td class="mono" style="background:transparent;border:none;">^GC d,t,c</td><td>Circle</td></tr>
        <tr><td class="mono">^FB</td><td>Field Block</td><td class="mono" style="background:transparent;border:none;">^FB400,2,0,C</td><td>Text wrapping & alignment</td></tr>
        <tr><td class="mono">^FR</td><td>Field Reverse</td><td class="mono" style="background:transparent;border:none;">^FR</td><td>Inverts text (white on black)</td></tr>
        <tr><td class="mono">~DG</td><td>Download Graphic</td><td class="mono" style="background:transparent;border:none;">~DGlogo,size,w,data</td><td>Stores image in printer memory</td></tr>
        <tr><td class="mono">^PQ</td><td>Print Quantity</td><td class="mono" style="background:transparent;border:none;">^PQ 10</td><td>Print 10 copies</td></tr>
        <tr><td class="mono">^LL</td><td>Label Length</td><td class="mono" style="background:transparent;border:none;">^LL 400</td><td>Label height in dots</td></tr>
        <tr><td class="mono">^LH</td><td>Label Home</td><td class="mono" style="background:transparent;border:none;">^LH 0,0</td><td>Offset origin of label</td></tr>
        <tr><td class="mono">^CI</td><td>Encoding</td><td class="mono" style="background:transparent;border:none;">^CI28</td><td>UTF-8 character encoding</td></tr>
        <tr><td class="mono">~TA</td><td>Tear-off adj.</td><td class="mono" style="background:transparent;border:none;">~TA000</td><td>Tear-off position</td></tr>
      </tbody>
    </table>
  </div>
</div>

<script>
function showLesson(id) {
  document.querySelectorAll('.lesson').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('lesson-'+id).classList.add('active');
  event.target.classList.add('active');
  if(id==='text') updateText();
  if(id==='barcode') updateBarcode();
}

function updateText() {
  const content = document.getElementById('txt-content').value || 'Text';
  const x = +document.getElementById('txt-x').value;
  const y = +document.getElementById('txt-y').value;
  const size = +document.getElementById('txt-size').value;
  const orient = document.getElementById('txt-orient').value;
  const align = document.getElementById('txt-align').value;

  document.getElementById('txt-x-val').textContent = x;
  document.getElementById('txt-y-val').textContent = y;
  document.getElementById('txt-size-val').textContent = size;

  let fb = '';
  if (align !== 'L') fb = "\\n^FB300,1,0," + align;

  document.getElementById('text-zpl').textContent = "^XA\\n^FO" + x + "," + y + "\\n^A0" + orient + "," + size + "," + size + fb + "\\n^FD" + content + "^FS\\n^XZ";
  const scale = 400/812;
  const sx = x * scale, sy = y * scale, fs = size * scale;
  const boxW = 300 * scale;

  let anchor = 'start';
  let textX = sx;
  if (align === 'C') { anchor = 'middle'; textX = sx + boxW/2; }
  if (align === 'R') { anchor = 'end'; textX = sx + boxW; }

  const svg = document.getElementById('text-preview');
  let helpers = '<circle cx="' + sx + '" cy="' + sy + '" r="4" fill="#714B67"/>';
  if (align !== 'L') {
    helpers += '<rect x="' + sx + '" y="' + sy + '" width="' + boxW + '" height="' + (fs+4) + '" fill="none" stroke="#714B67" stroke-dasharray="4 4" stroke-width="1.5"/>';
  }

  svg.innerHTML = '<rect width="400" height="260" fill="#fff"/>' + helpers +
    '<text x="' + textX + '" y="' + (sy+fs*0.85) + '" font-family="monospace" font-weight="600" font-size="' + Math.max(9,fs) + '" fill="#0f172a" text-anchor="' + anchor + '" ' + (orient==='I'?'transform="rotate(180,'+(sx+fs*3)+','+(sy+fs*0.5)+')"':'') + '>' + escHtml(content) + '</text>';
}

function updateBarcode() {
  const data = document.getElementById('bc-data').value || '12345';
  const type = document.getElementById('bc-type').value;
  const h = +document.getElementById('bc-height').value;
  const x = +document.getElementById('bc-x').value;
  const y = +document.getElementById('bc-y').value;
  document.getElementById('bc-height-val').textContent = h;
  document.getElementById('bc-x-val').textContent = x;
  document.getElementById('bc-y-val').textContent = y;
  const typeName = {'BC':'Code 128','BE':'EAN-13','BQ':'QR Code'}[type];
  document.getElementById('bc-zpl').textContent = "^XA\\n^FO" + x + "," + y + "\\n^BY2,3," + h + "\\n^" + type + "N," + h + ",Y,N\\n^FD" + data + "^FS\\n^XZ";
  const scale = 400/812;
  const sx = x*scale, sy=y*scale, bh=h*scale;
  const svg = document.getElementById('bc-preview');
  let bars = '';
  if(type==='BQ') {
    const q=Math.min(bh,90), qx=sx, qy=sy;
    const cell=q/7;
    const pattern=[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],[1,0,1,0,1,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]];
    for(let r=0;r<7;r++) for(let c=0;c<7;c++) if(pattern[r][c]) bars+='<rect x="' + (qx+c*cell) + '" y="' + (qy+r*cell) + '" width="' + cell + '" height="' + cell + '" fill="#0f172a"/>';
    bars+='<text x="' + qx + '" y="' + (qy+q+16) + '" font-family="monospace" font-weight="600" font-size="10" fill="#475569">' + escHtml(data) + '</text>';
  } else {
    const bw=2.5, chars=data.length, totalW=chars*6*bw;
    for(let i=0;i<chars*5;i++) {
      if(i%3!==1) bars+='<rect x="' + (sx+i*bw) + '" y="' + sy + '" width="' + bw + '" height="' + bh + '" fill="#0f172a"/>';
    }
    bars+='<text x="' + (sx+totalW/2) + '" y="' + (sy+bh+16) + '" text-anchor="middle" font-family="monospace" font-weight="600" font-size="10" fill="#0f172a">' + escHtml(data) + '</text>';
  }
  svg.innerHTML = '<rect width="400" height="260" fill="#fff"/><text x="12" y="18" font-size="11" fill="#94a3b8" font-weight="600" font-family="monospace">' + typeName + '</text>' + bars;
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

updateText();
updateBarcode();
</script>
</body>
</html>
`;

const App = () => {
  const [zplCode, setZplCode] = useState(`^XA
^FO40,30^A0N,35,35^FDZPL STUDIO^FS
^FO40,75^A0N,22,22^FDSample 2X1 Label^FS
^BY2,2,50
^FO40,115^BCN,50,Y,N,N^FDZPL-8675309^FS
^XZ`);

  const [unit, setUnit] = useState('inch');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(1);
  const [dpmm, setDpmm] = useState(8); 
  
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  
  const [showGuide, setShowGuide] = useState(false);
  const [showUserGuide, setShowUserGuide] = useState(false);
  
  const isFirstRender = useRef(true);

  const toInches = (val) => unit === 'inch' ? val : (val / 25.4);
  const formatNum = (val) => parseFloat(val.toFixed(2));

  const handleUnitChange = (newUnit) => {
    if (newUnit === unit) return;
    if (newUnit === 'inch') {
      setWidth(formatNum(width / 25.4));
      setHeight(formatNum(height / 25.4));
    } else {
      setWidth(formatNum(width * 25.4));
      setHeight(formatNum(height * 25.4));
    }
    setUnit(newUnit);
  };

  const fetchPreview = useCallback(async () => {
    if (!zplCode.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    const widthIn = toInches(width).toFixed(2);
    const heightIn = toInches(height).toFixed(2);
    
    const url = `https://api.labelary.com/v1/printers/${dpmm}dpmm/labels/${widthIn}x${heightIn}/0/`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'image/png',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: zplCode
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `API error ${response.status}`);
      }

      const blob = await response.blob();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const imageUrl = URL.createObjectURL(blob);
      setPreviewUrl(imageUrl);
      setLastSaved(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("ZPL Render Error:", err);
      setError(err.message.includes("Failed to fetch") 
        ? "Connection Error: Unable to reach the rendering server. Please check your internet connection."
        : `Syntax Error: Could not render the label. Please verify your ZPL script. (${err.message})`);
    } finally {
      setIsLoading(false);
    }
  }, [zplCode, width, height, dpmm, unit, previewUrl]);

  useEffect(() => {
    if (isFirstRender.current) {
      fetchPreview();
      isFirstRender.current = false;
    }
  }, [fetchPreview]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        fetchPreview();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fetchPreview]);

  // Robust Direct Download Implementation
  const handleDownload = async () => {
    if (!previewUrl) return;
    
    setIsExporting(true);
    try {
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const link = document.createElement('a');
        link.href = reader.result;
        link.download = `ZPL_Label_${width}x${height}${unit}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => setIsExporting(false), 2000);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error("Export Error:", err);
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
      
      {/* Header - Modern SaaS Style */}
      <header className="relative z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-5 sm:px-8 py-3.5 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-[#714B67] to-[#5a3c52] p-2 rounded-lg text-white shadow-md shadow-[#714B67]/20 border border-[#714B67]/20">
            <ZPLLogo className="w-7 h-7 drop-shadow-md" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col justify-center">
              <h1 className="text-lg sm:text-xl font-black tracking-tight leading-none text-slate-800">
                ZPL <span className="text-[#714B67]">STUDIO</span>
              </h1>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest mt-1 uppercase">Label Designer</span>
            </div>
            {lastSaved && (
              <>
                <div className="w-px h-6 bg-slate-200 hidden sm:block mx-1" />
                <span className="text-[9px] text-[#017E84] font-black bg-[#017E84]/10 px-2.5 py-1.5 rounded-md border border-[#017E84]/20 shadow-sm hidden sm:flex items-center gap-1.5 uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#017E84] animate-pulse" />
                  Synced: {lastSaved}
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowUserGuide(true)}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-200 active:scale-95 shadow-sm hover:shadow-md group"
          >
            <HelpCircle size={16} className="text-[#017E84] group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">How-To Guide</span>
          </button>

          <button 
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-200 active:scale-95 shadow-sm hover:shadow-md group"
          >
            <BookOpen size={16} className="text-[#714B67] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">ZPL Dictionary</span>
          </button>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
        
        {/* Left Side: Editor Panel */}
        <section className="w-full lg:w-[42%] flex flex-col bg-white shadow-[10px_0_30px_-15px_rgba(0,0,0,0.05)] z-20 shrink-0 border-r border-slate-200/60">
          
          {/* Metrics Controls */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-end">
            <div className="space-y-2 shrink-0">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Ruler size={12} className="text-slate-400" /> Unit
              </label>
              <div className="flex bg-slate-200/70 p-1 rounded-xl shadow-inner border border-slate-200/50">
                <button onClick={() => handleUnitChange('mm')} className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all duration-200 ${unit === 'mm' ? 'bg-white text-[#714B67] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>mm</button>
                <button onClick={() => handleUnitChange('inch')} className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all duration-200 ${unit === 'inch' ? 'bg-white text-[#714B67] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>in</button>
              </div>
            </div>

            <div className="space-y-2 flex-1 min-w-[70px]">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Width</label>
              <input type="number" step="0.01" value={width} onChange={(e) => setWidth(parseFloat(e.target.value) || 0)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#714B67]/10 focus:border-[#714B67] outline-none transition-all text-sm font-mono font-bold shadow-sm" />
            </div>

            <div className="space-y-2 flex-1 min-w-[70px]">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Height</label>
              <input type="number" step="0.01" value={height} onChange={(e) => setHeight(parseFloat(e.target.value) || 0)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#714B67]/10 focus:border-[#714B67] outline-none transition-all text-sm font-mono font-bold shadow-sm" />
            </div>

            <div className="space-y-2 flex-1 min-w-[100px]">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Density</label>
              <div className="relative">
                <select value={dpmm} onChange={(e) => setDpmm(parseInt(e.target.value))} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#714B67]/10 focus:border-[#714B67] outline-none transition-all text-sm font-bold cursor-pointer shadow-sm appearance-none pr-10">
                  <option value={8}>203 DPI</option>
                  <option value={12}>300 DPI</option>
                  <option value={24}>600 DPI</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* IDE Editor Area */}
          <div className="flex-1 flex flex-col relative bg-[#fafafa]">
            <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 mr-3">
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                </div>
                <Code size={14} className="text-slate-400" />
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">label_script.zpl</span>
              </div>
            </div>
            
            <textarea
              value={zplCode}
              onChange={(e) => setZplCode(e.target.value)}
              className="flex-1 w-full p-6 pb-28 font-mono text-[13px] leading-relaxed text-slate-700 bg-transparent focus:outline-none resize-none selection:bg-[#714B67]/20 custom-scrollbar shadow-inner"
              spellCheck="false"
              placeholder="^XA ... ^XZ"
            />

            {/* Error Toast */}
            {error && (
              <div className="absolute bottom-24 left-6 right-6 z-10 bg-red-50/95 backdrop-blur-md border border-red-200 p-4 rounded-xl flex items-start gap-3 text-red-700 shadow-2xl animate-in">
                <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-500" />
                <div className="text-xs flex-1">
                  <p className="font-black mb-1 uppercase tracking-wider">Label Render Error</p>
                  <p className="opacity-90 font-mono break-all max-h-24 overflow-y-auto custom-scrollbar">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="text-red-400 hover:text-red-700 p-1 transition-colors">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Premium Floating Action Button - Compact */}
            <button 
              onClick={fetchPreview}
              disabled={isLoading}
              className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-gradient-to-r from-[#714B67] to-[#5a3c52] hover:from-[#5a3c52] hover:to-[#4a3043] disabled:from-slate-400 disabled:to-slate-500 text-white px-4 py-2.5 rounded-full text-[11px] font-bold transition-all hover:-translate-y-1 shadow-[0_8px_25px_-5px_rgba(113,75,103,0.6)] active:scale-95 group"
              title="Preview Label (Ctrl+S)"
            >
              {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} className="group-hover:text-yellow-300 transition-colors" />}
              RENDER LABEL
              <span className="opacity-80 text-[8px] font-black bg-white/20 px-1.5 py-0.5 rounded ml-1 hidden sm:inline border border-white/10">
                ^S
              </span>
            </button>
          </div>
        </section>

        {/* Right Side: Canvas & Printer Preview Area */}
        <section className="flex-1 relative flex flex-col overflow-hidden bg-slate-50 z-0">
          <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-40">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-sm pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-[#017E84] shadow-[0_0_8px_#017E84]" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest text-xs">Virtual Printer</span>
            </div>
            
            {/* FIXED EXPORT PNG BUTTON - Direct Access */}
            <button 
              onClick={handleDownload}
              disabled={!previewUrl || isLoading}
              className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 text-xs font-black text-slate-700 bg-white shadow-lg hover:bg-slate-50 rounded-xl transition-all disabled:opacity-40 border border-slate-200 active:scale-95 group z-50 cursor-pointer"
            >
              {isExporting ? <Check size={16} className="text-emerald-500" /> : <Download size={16} className="group-hover:-translate-y-0.5 transition-transform text-[#714B67]" />}
              {isExporting ? 'EXPORTED!' : 'EXPORT PNG'}
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-start p-12 pt-28 overflow-auto custom-scrollbar relative z-10">
            {/* MODERN SLEEK PRINTER MOCKUP */}
            <div className="relative flex flex-col items-center w-full max-w-[500px]">
              <div className="relative w-full h-32 bg-gradient-to-b from-[#1e293b] to-[#0f172a] rounded-t-3xl shadow-2xl border-t border-x border-slate-700/50 flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="absolute top-5 flex items-center gap-3 bg-black/40 px-4 py-1.5 rounded-full border border-white/5 shadow-inner">
                  <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] animate-pulse' : 'bg-[#00A09D] shadow-[0_0_10px_#00A09D]'}`} />
                  <span className="text-[10px] font-mono text-slate-300 font-bold tracking-widest">
                    {isLoading ? 'PROCESSING' : 'ONLINE'}
                  </span>
                </div>
                <div className="absolute bottom-5 flex items-center justify-center bg-slate-900/90 border border-slate-700/80 px-6 py-2.5 rounded-full shadow-inner backdrop-blur-md">
                  <span className="text-[11px] font-mono text-slate-100 font-bold tracking-widest flex items-center gap-3">
                    {width} × {height} {unit.toUpperCase()} 
                    <span className="text-slate-600">|</span> 
                    <span className="text-[#00A09D] drop-shadow-[0_0_8px_rgba(0,160,157,0.5)]">{dpmm} DPMM</span>
                  </span>
                </div>
              </div>

              <div className="relative w-[102%] h-8 bg-[#020617] z-20 -mx-[1%] shadow-[0_10px_20px_-5px_rgba(0,0,0,0.5)] border-x border-b border-slate-800 rounded-b-xl flex justify-center items-start">
                 <div className="w-[92%] h-2 bg-black rounded-b-md shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)] border-t border-slate-800"></div>
              </div>

              <div className="relative z-10 w-full flex flex-col items-center">
                {previewUrl ? (
                  <div className={`relative transition-all duration-700 origin-top ${isLoading ? 'opacity-50 blur-sm scale-[0.98]' : 'opacity-100 scale-100'}`}>
                    <div className="absolute -inset-x-8 -bottom-16 h-24 bg-black/5 blur-2xl rounded-full pointer-events-none" />
                    <div className="bg-[#fefce8] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] rounded-sm overflow-hidden border border-yellow-200/60 flex flex-col items-center mt-[-4px]">
                      <div className="h-4 w-full bg-gradient-to-b from-black/20 to-transparent opacity-30" />
                      <div className="h-4 w-full flex items-center justify-center bg-[#fefce8]">
                         <div className="w-[90%] border-b border-dashed border-yellow-400/50" />
                      </div>
                      <div className="w-full h-2" />
                      <div className="w-[94%] relative bg-white rounded shadow-sm border border-slate-200 flex justify-center">
                        <img src={previewUrl} alt="ZPL Print Result" className="bg-white max-w-full h-auto block" style={{ maxHeight: '65vh' }} />
                      </div>
                      <div className="w-full h-2" />
                      <div className="h-4 w-full flex items-center justify-center bg-[#fefce8]">
                         <div className="w-[90%] border-b border-dashed border-yellow-400/50" />
                      </div>
                      <div className="h-6 w-[94%] bg-white/50 rounded-t-sm shadow-inner border-t border-slate-200/50" />
                    </div>
                  </div>
                ) : !isLoading ? (
                  <div className="mt-16 p-8 rounded-3xl bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-300 shadow-sm flex flex-col items-center gap-4 text-center w-3/4">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-[#714B67]">
                       <Layers size={24} />
                    </div>
                    <div>
                      <p className="text-slate-800 font-black text-sm uppercase tracking-widest">Canvas Empty</p>
                      <p className="text-slate-500 text-xs mt-2 max-w-[200px] leading-relaxed">Update your ZPL script and click render to visualize the output.</p>
                    </div>
                  </div>
                ) : null}
                {isLoading && !previewUrl && (
                  <div className="flex flex-col items-center gap-4 p-10 mt-16 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-100">
                    <RefreshCw size={36} className="text-[#017E84] animate-spin" />
                    <p className="text-slate-700 font-black text-xs tracking-widest animate-pulse">GENERATING PREVIEW...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 inset-x-0 p-3 bg-white/60 backdrop-blur-md border-t border-slate-200/50 flex justify-between items-center z-10 px-6 text-xs text-slate-400">
            <div className="flex gap-4">
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold uppercase tracking-widest mr-1">Built for Odooers by</span>
              <span className="text-[11px] font-black text-[#714B67]">Mohan kumar</span>
            </div>
          </div>
        </section>
      </main>

      {/* Embedded Modals... */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-8 animate-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <BookOpen className="text-[#714B67]" size={20}/> Interactive ZPL Learning Guide
              </h2>
              <button onClick={() => setShowGuide(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 bg-white overflow-hidden relative">
              <iframe srcDoc={GUIDE_HTML} className="absolute inset-0 w-full h-full border-0" title="ZPL Interactive Guide" />
            </div>
          </div>
        </div>
      )}

      {showUserGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-8 animate-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <HelpCircle className="text-[#017E84]" size={20}/> How to use ZPL Studio
              </h2>
              <button onClick={() => setShowUserGuide(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 sm:p-8 space-y-4 overflow-y-auto max-h-[70vh] bg-slate-50/50 custom-scrollbar text-sm">
              {[
                { title: "Export from Odoo", desc: "Generate and download your desired ZPL label file directly from your Odoo system." },
                { title: "Paste your Script", desc: "Open the downloaded file using any text editor, copy the raw ZPL code, and paste it into the Source Script editor on the left." },
                { title: "Configure Dimensions", desc: "Use the Metrics panel at the top to set the exact physical width, height, and print density (DPI) of your label." },
                { title: "Generate Preview", desc: "Click the Render Label button (or press Ctrl+S) to render a high-fidelity thermal print preview!", highlighted: true },
                { title: "Fine-Tune Layout", desc: "Modify your ZPL code directly in the editor to rearrange elements, adjust coordinates, and ensure all content fits beautifully." },
                { title: "Update Odoo Template", desc: "Select your label template in Odoo, copy your newly adjusted coordinates from the previewer, and paste them into your Odoo database." }
              ].map((step, i) => (
                <div key={i} className={`flex gap-4 items-start bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-colors ${step.highlighted ? 'border-[#017E84]/30 bg-[#017E84]/5' : 'hover:border-[#714B67]/30'}`}>
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-black text-sm ${step.highlighted ? 'bg-[#017E84] text-white' : 'bg-[#714B67]/10 text-[#714B67]'}`}>{i + 1}</div>
                  <div>
                    <h3 className={`font-black text-sm mb-1.5 ${step.highlighted ? 'text-[#017E84]' : 'text-slate-800'}`}>{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slide-in-from-bottom-4 { from { transform: translateY(1.5rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-in { animation: slide-in-from-bottom-4 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}} />
    </div>
  );
};

export default App;