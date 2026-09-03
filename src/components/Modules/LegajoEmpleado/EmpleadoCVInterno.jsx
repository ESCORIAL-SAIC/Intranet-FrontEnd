import './EmpleadoCVInterno.css';
import logo from '../../../img/logo.png';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function formatMesAnio(fechaStr) {
    if (!fechaStr) return null;
    const d = new Date(fechaStr);
    if (isNaN(d)) return null;
    return `${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

function parsePct(resultado, tipoEval) {
    if (resultado == null) return null;
    const match = String(resultado).match(/-?\d+(\.\d+)?/);
    if (!match) return null;
    const num = parseFloat(match[0]);
    const esLiderazgo = /liderazgo/i.test(tipoEval || '');
    const pct = esLiderazgo ? (num / 12) * 100 : Math.min(num, 100);
    return Math.max(0, Math.min(100, pct));
}

function dotsFromPct(pct) {
    return Math.max(0, Math.min(5, Math.round(pct / 20)));
}

// La lista debajo del radar en "Genoma · Perfil integral" solo muestra estos dos tipos de evaluación
// (el radar en sí sigue usando todos los tipos disponibles).
const TIPOS_PERFIL_INTEGRAL = ['rasgos cognitivos', 'rasgos de personalidad'];

function agruparGenoma(genoma) {
    const grupos = {};
    const orden = [];
    (genoma || []).forEach(row => {
        const key = row.tipo_eval || 'General';
        if (!grupos[key]) {
            grupos[key] = [];
            orden.push(key);
        }
        grupos[key].push(row);
    });
    return orden.map(key => ({ tipo: key, items: grupos[key] }));
}

function polarPoint(cx, cy, r, angleDeg) {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function buildRadar(axes) {
    if (axes.length < 3) return null;
    const cx = 86, cy = 86, maxR = 62;
    const n = axes.length;
    const angleStep = 360 / n;

    const rings = [0.33, 0.66, 1].map(f =>
        axes.map((_, i) => polarPoint(cx, cy, maxR * f, i * angleStep).join(',')).join(' ')
    );

    const axisLines = axes.map((_, i) => polarPoint(cx, cy, maxR, i * angleStep));

    const dataPoints = axes.map((a, i) => polarPoint(cx, cy, maxR * (a.pct / 100), i * angleStep));
    const dataPolygon = dataPoints.map(p => p.join(',')).join(' ');

    const labels = axes.map((a, i) => {
        const [x, y] = polarPoint(cx, cy, maxR + 20, i * angleStep);
        let anchor = 'middle';
        if (x > cx + 4) anchor = 'start';
        else if (x < cx - 4) anchor = 'end';
        return { x, y, anchor, label: a.tipo };
    });

    return { cx, cy, rings, axisLines, dataPoints, dataPolygon, labels };
}

function splitDescripcion(descripcion) {
    if (!descripcion) return [];
    return descripcion
        .split(/\r?\n|(?<=[.;])\s+(?=[A-ZÁÉÍÓÚÑ])/)
        .map(s => s.trim())
        .filter(Boolean);
}

function GRow({ item, tipo }) {
    const pct = parsePct(item.resultado, tipo);
    if (pct == null) {
        return (
            <div className="cvi-g-row">
                <span className="cvi-g-label">{item.evaluacion}</span>
                <span className="cvi-lang-lvl">{item.resultado || '—'}</span>
            </div>
        );
    }
    const dots = dotsFromPct(pct);
    return (
        <div className="cvi-g-row">
            <span className="cvi-g-label">{item.evaluacion}</span>
            <div className="cvi-g-dots">
                {[0, 1, 2, 3, 4].map(i => (
                    <span key={i} className={`cvi-gd ${i < dots ? 'cvi-on' : ''}`}></span>
                ))}
            </div>
        </div>
    );
}

function EmpleadoCVInterno({ empleado = {}, genoma = [], cvDatos }) {
    const cv = cvDatos?.cv_datos || null;

    const grupos = agruparGenoma(genoma);
    const gruposPerfilIntegral = grupos.filter(g => TIPOS_PERFIL_INTEGRAL.includes((g.tipo || '').trim().toLowerCase()));
    const radarAxes = grupos
        .map(g => {
            const pcts = g.items.map(i => parsePct(i.resultado, g.tipo)).filter(p => p != null);
            if (!pcts.length) return null;
            return { tipo: g.tipo, pct: pcts.reduce((a, b) => a + b, 0) / pcts.length };
        })
        .filter(Boolean)
        .slice(0, 8);
    const radar = buildRadar(radarAxes);

    const areaODeUet = empleado.sector || empleado.gerencia || '—';
    const correo = empleado.email || cv?.email || '—';

    const fechas = [...(genoma || []).map(g => g.fecha), cvDatos?.fecha].filter(Boolean);
    const fechaActualizacion = fechas.length
        ? fechas.reduce((max, f) => (new Date(f) > new Date(max) ? f : max))
        : null;

    return (
        <div className="cvi-page">
            <div className="cvi-card">

                {/* HERO */}
                <div className="cvi-hero">
                    <div className="cvi-hero-text">
                        <div className="cvi-hero-tag">CV Interno · Uso exclusivo RRHH</div>
                        <div className="cvi-hero-name">{empleado.nombre || 'Sin nombre'}</div>
                        <div className="cvi-hero-role">
                            {[empleado.puesto, areaODeUet !== '—' ? areaODeUet : null].filter(Boolean).join(' · ')}
                        </div>
                        <div className="cvi-hero-meta">
                            <div className="cvi-meta-chip">Correo&nbsp;<span>{correo}</span></div>
                            {empleado.fecha_ingreso && (
                                <div className="cvi-meta-chip">Ingreso&nbsp;<span>{formatMesAnio(empleado.fecha_ingreso)}</span></div>
                            )}
                        </div>
                    </div>

                    <div className="cvi-hero-photo">
                        <div className="cvi-photo-frame">
                            {empleado.image ? (
                                <img src={"data:image/png;base64, " + empleado.image} alt="" />
                            ) : (
                                <div className="cvi-photo-placeholder">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                                    </svg>
                                    <div className="cvi-photo-placeholder-label">Foto</div>
                                </div>
                            )}
                        </div>
                        <div className="cvi-hero-logos">
                            <img className="cvi-logo-escorial" src={logo} alt="Escorial" />
                        </div>
                    </div>
                </div>

                {/* STRIP */}
                <div className="cvi-strip">
                    <div className="cvi-strip-item">
                        <div className="cvi-strip-label">Área / UET</div>
                        <div className="cvi-strip-val">{areaODeUet}</div>
                    </div>
                    <div className="cvi-strip-item">
                        <div className="cvi-strip-label">Correo interno</div>
                        <div className="cvi-strip-val">{correo}</div>
                    </div>
                    <div className="cvi-strip-item">
                        <div className="cvi-strip-label">Actualización</div>
                        <div className="cvi-strip-val">{formatMesAnio(fechaActualizacion) || '—'}</div>
                    </div>
                </div>

                {/* BODY */}
                <div className="cvi-body">

                    {/* MAIN */}
                    <div className="cvi-col-main">

                        <div className="cvi-section">
                            <div className="cvi-s-head">Perfil profesional</div>
                            <div className="cvi-profile-quote">
                                {cv?.perfil_profesional || 'No hay perfil profesional cargado. Suba el CV del colaborador para completar esta sección.'}
                            </div>
                        </div>

                        <div className="cvi-section">
                            <div className="cvi-s-head">Experiencia laboral</div>
                            {cv?.experiencia_laboral?.length ? (
                                <div className="cvi-timeline">
                                    {cv.experiencia_laboral.map((exp, idx) => (
                                        <div className="cvi-tl-item" key={idx}>
                                            <div className="cvi-tl-line">
                                                <div className="cvi-tl-dot"></div>
                                                <div className="cvi-tl-connector"></div>
                                            </div>
                                            <div className="cvi-tl-content">
                                                <div className="cvi-tl-header">
                                                    <div className="cvi-tl-title">
                                                        {[exp.puesto, exp.empresa].filter(Boolean).join(' · ') || 'Puesto no especificado'}
                                                    </div>
                                                    <div className="cvi-tl-period">
                                                        {(exp.fecha_inicio || '?') + ' – ' + (exp.fecha_fin || 'Presente')}
                                                    </div>
                                                </div>
                                                {splitDescripcion(exp.descripcion).length > 0 && (
                                                    <div className="cvi-tl-bullets">
                                                        {splitDescripcion(exp.descripcion).map((b, i) => (
                                                            <div className="cvi-tl-b" key={i}>{b}</div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="cvi-sin-datos">Sin experiencia laboral cargada.</div>
                            )}
                        </div>

                        <div className="cvi-section">
                            <div className="cvi-s-head">Formación académica</div>
                            {cv?.educacion?.length ? (
                                <div className="cvi-edu-list">
                                    {cv.educacion.map((edu, idx) => (
                                        <div className="cvi-edu-item" key={idx}>
                                            <div className="cvi-edu-yr">{edu.fecha_fin || edu.fecha_inicio || ''}</div>
                                            <div>
                                                <div className="cvi-edu-name">{edu.titulo || 'Título no especificado'}</div>
                                                <div className="cvi-edu-inst">{edu.institucion || ''}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="cvi-sin-datos">Sin formación académica cargada.</div>
                            )}
                        </div>

                    </div>

                    {/* SIDE */}
                    <div className="cvi-col-side">

                        {/* GENOMA */}
                        <div className="cvi-side-section">
                            <div className="cvi-ss-head">Genoma · Perfil integral</div>

                            {radar ? (
                                <div className="cvi-genome-radar-wrap">
                                    <svg width="172" height="172" viewBox="0 0 172 172" xmlns="http://www.w3.org/2000/svg">
                                        {radar.rings.map((pts, i) => (
                                            <polygon key={i} points={pts} fill="none" stroke="#D6E6F7" strokeWidth="0.8" />
                                        ))}
                                        {radar.axisLines.map((p, i) => (
                                            <line key={i} x1={radar.cx} y1={radar.cy} x2={p[0]} y2={p[1]} stroke="#D6E6F7" strokeWidth="0.8" />
                                        ))}
                                        <polygon points={radar.dataPolygon} fill="rgba(43,90,168,0.12)" stroke="#2B5AA8" strokeWidth="1.5" strokeLinejoin="round" />
                                        {radar.dataPoints.map((p, i) => (
                                            <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#2B5AA8" />
                                        ))}
                                        {radar.labels.map((l, i) => (
                                            <text key={i} x={l.x} y={l.y} textAnchor={l.anchor} className="cvi-radar-label">{l.label}</text>
                                        ))}
                                    </svg>
                                </div>
                            ) : (
                                <div className="cvi-sin-datos">Sin datos suficientes de Genoma para el radar.</div>
                            )}

                            {gruposPerfilIntegral.map(({ tipo, items }) => (
                                <div key={tipo}>
                                    <div className="cvi-genome-group-label">{tipo}</div>
                                    {items.map((item, idx) => (
                                        <GRow key={idx} item={item} tipo={tipo} />
                                    ))}
                                </div>
                            ))}

                            {gruposPerfilIntegral.length === 0 && (
                                <div className="cvi-sin-datos">No hay evaluaciones de Genoma cargadas para este colaborador.</div>
                            )}
                        </div>

                        {/* IDIOMAS */}
                        <div className="cvi-side-section">
                            <div className="cvi-ss-head">Idiomas</div>
                            {cv?.idiomas?.length ? (
                                cv.idiomas.map((lang, idx) => (
                                    <div className="cvi-lang-row" key={idx}>
                                        <span className="cvi-lang-name">{lang.idioma}</span>
                                        <span className="cvi-lang-lvl">{lang.nivel}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="cvi-sin-datos">Sin idiomas cargados.</div>
                            )}
                        </div>

                        {/* FORMACIÓN COMPLEMENTARIA */}
                        <div className="cvi-side-section">
                            <div className="cvi-ss-head">Formación complementaria</div>
                            {cv?.certificaciones?.length ? (
                                cv.certificaciones.map((cert, idx) => (
                                    <div className="cvi-cert-item" key={idx}>
                                        <div className="cvi-cert-name">{cert}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="cvi-sin-datos">Sin certificaciones cargadas.</div>
                            )}
                        </div>

                    </div>
                </div>

                {/* FOOTER */}
                <div className="cvi-footer">
                    <span className="cvi-footer-l">Uso Interno · Escorial Recursos Humanos</span>
                    <span className="cvi-footer-r">Confidencial</span>
                </div>

            </div>
        </div>
    );
}

export default EmpleadoCVInterno;
