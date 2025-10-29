// =======================================================
// DATOS DE PRUEBA (MOCK DATA)
// =======================================================
let data = {
  // Simulando que el usuario ya está logueado como 'admin'
  currentUser: {
    username: "admin",
    role: "Administrador",
    name: "Administrador",
  },
  config: {
    cuotaBase: 150000,
    tasaInteres: 2.5, // %
  },
  apartamentos: [
    {
      apto: "A101",
      propietario: "Ana Pérez",
      telefono: "3101234567",
      email: "a.perez@email.com",
      residentes: 3,
      cuota: 150000,
      estado: "corriente",
      deuda: 0,
    },
    {
      apto: "A102",
      propietario: "Carlos Gómez",
      telefono: "3209876543",
      email: "c.gomez@email.com",
      residentes: 2,
      cuota: 150000,
      estado: "moroso",
      deuda: 300000,
    },
    {
      apto: "B201",
      propietario: "Elena Torres",
      telefono: "3005551122",
      email: "e.torres@email.com",
      residentes: 4,
      cuota: 150000,
      estado: "corriente",
      deuda: 0,
    },
    {
      apto: "B202",
      propietario: "David Reyes",
      telefono: "3157778899",
      email: "d.reyes@email.com",
      residentes: 1,
      cuota: 150000,
      estado: "moroso",
      deuda: 450000,
    },
    {
      apto: "C301",
      propietario: "Felipe Castro",
      telefono: "3114443322",
      email: "f.castro@email.com",
      residentes: 5,
      cuota: 150000,
      estado: "corriente",
      deuda: 0,
    },
    {
      apto: "C302",
      propietario: "Gloria Ruiz",
      telefono: "3016669988",
      email: "g.ruiz@email.com",
      residentes: 2,
      cuota: 150000,
      estado: "moroso",
      deuda: 150000,
    },
  ],
  transacciones: [
    {
      tipo: "pago",
      fecha: "2025-10-25",
      detalle: "Cuota A101",
      monto: 150000,
      apto: "A101",
    },
    {
      tipo: "gasto",
      fecha: "2025-10-24",
      detalle: "Mantenimiento ascensores",
      monto: 500000,
      categoria: "Mantenimiento",
    },
    {
      tipo: "pago",
      fecha: "2025-09-20",
      detalle: "Cuota B201",
      monto: 150000,
      apto: "B201",
    },
    {
      tipo: "gasto",
      fecha: "2025-09-15",
      detalle: "Factura de agua",
      monto: 350000,
      categoria: "Servicios",
    },
    {
      tipo: "pago",
      fecha: "2025-08-10",
      detalle: "Cuota C301",
      monto: 150000,
      apto: "C301",
    },
  ],
  vehiculos: [
    { apto: "A101", tipo: "Automóvil", marca: "Mazda", placa: "ABC123" },
    { apto: "A102", tipo: "Motocicleta", marca: "Yamaha", placa: "DEF45G" },
    { apto: "B201", tipo: "Automóvil", marca: "Toyota", placa: "HIJ789" },
  ],
  bitacora: [
    { fecha: "2025-10-25", usuario: "admin", accion: "Registro de pago A101" },
    {
      fecha: "2025-10-24",
      usuario: "admin",
      accion: "Registro de gasto Mantenimiento",
    },
    {
      fecha: "2025-10-01",
      usuario: "admin",
      accion: "Cambio de cuota base a $150.000",
    },
  ],
};

// =======================================================
// UTILITY: NOTIFICACIONES MEJORADAS (Reemplazo de alert())
// =======================================================

/**
 * Muestra una notificación personalizada (toast) en la esquina superior derecha.
 * @param {string} message - Mensaje a mostrar.
 * @param {string} type - Tipo de notificación ('success', 'danger', 'warning').
 */
function showNotification(message, type = "success") {
  const container = document.getElementById("notificationContainer");
  const notification = document.createElement("div");

  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  container.appendChild(notification);

  // Muestra la notificación con un pequeño retraso para la transición CSS
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Oculta y elimina la notificación después de 4 segundos
  setTimeout(() => {
    notification.classList.remove("show");
    notification.addEventListener("transitionend", () => {
      notification.remove();
    });
  }, 4000);
}

/**
 * Lee un File y devuelve un dataURL (Promise).
 * @param {File} file
 * @returns {Promise<string>} dataURL
 */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Error leyendo archivo"));
    reader.readAsDataURL(file);
  });
}

// =======================================================
// INICIALIZACIÓN Y NAVEGACIÓN
// =======================================================

/**
 * Inicializa la aplicación al cargar la página.
 * NOTA: La lógica de login ha sido eliminada. Se asume que el usuario ya está dentro.
 */
function initApp() {
  // Configura la información de usuario en el header (se usa el mock data)
  document.getElementById("userName").textContent = data.currentUser.name;
  document.getElementById("userRole").textContent = data.currentUser.role;

  // Cargar datos iniciales en el Dashboard y otras secciones
  updateStats();
  loadCharts();
  loadTableMorosos();
  loadCartera();
  loadPagosForms();
  loadTransacciones();
  loadCenso();
  loadVehiculos();
  loadBitacora();
  loadConfigForm();
  // Listener para el formulario de agregar/editar residente (modal)
  const formResident = document.getElementById("formResident");
  if (formResident) {
    formResident.addEventListener("submit", handleFormResident);
  }
  // Listener para el formulario de agregar/editar vehículo (modal)
  const formVehicle = document.getElementById("formVehicle");
  if (formVehicle) {
    formVehicle.addEventListener("submit", handleFormVehicle);
  }
}

/**
 * Muestra la página de contenido seleccionada en la barra lateral.
 * @param {string} pageId - ID de la página a mostrar (ej: 'dashboard', 'cartera').
 */
function showPage(pageId) {
  // Ocultar todas las páginas
  document.querySelectorAll(".page-content").forEach((page) => {
    page.classList.add("hidden");
  });

  // Remover 'active' de todos los elementos de navegación
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Mostrar la página seleccionada
  const targetPage = document.getElementById(
    "page" + pageId.charAt(0).toUpperCase() + pageId.slice(1)
  );
  if (targetPage) {
    targetPage.classList.remove("hidden");
  }

  // Activar el elemento de navegación correspondiente
  document
    .querySelector(`.nav-item[onclick*="'${pageId}'"]`)
    .classList.add("active");

  // Recargar datos específicos si es necesario (ej. para actualizar gráficos)
  if (pageId === "dashboard") {
    updateStats();
    loadCharts();
  }
  if (pageId === "cartera") {
    loadCartera();
  }
}

/**
 * Simula el cierre de sesión (en un entorno sin login, solo recarga la página o muestra un mensaje).
 */
function logout() {
  showNotification(
    "Sesión cerrada (simulado). Tendrías que volver a la pantalla de login.",
    "warning"
  );
  // En el caso original, esto redirigiría a la pantalla de login, pero como la eliminamos, solo recargamos.
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

// =======================================================
// DASHBOARD (Stats & Charts)
// =======================================================

function updateStats() {
  // CÁLCULOS
  const totalRecaudado = data.transacciones
    .filter((t) => t.tipo === "pago")
    .reduce((sum, t) => sum + t.monto, 0);

  const totalGastos = data.transacciones
    .filter((t) => t.tipo === "gasto")
    .reduce((sum, t) => sum + t.monto, 0);

  const totalPendiente = data.apartamentos.reduce((sum, a) => sum + a.deuda, 0);

  const aptosMorosos = data.apartamentos.filter(
    (a) => a.estado === "moroso"
  ).length;

  // ACTUALIZAR HTML
  document.getElementById("statRecaudado").textContent =
    formatCurrency(totalRecaudado);
  document.getElementById("statGastos").textContent =
    formatCurrency(totalGastos);
  document.getElementById("statPendiente").textContent =
    formatCurrency(totalPendiente);
  document.getElementById("statMorosos").textContent = aptosMorosos;
}

// Global chart variables to allow destruction and recreation
let flujoChart = null;
let egresosChart = null;

function loadCharts() {
  // Destruir gráficos anteriores para evitar duplicados
  if (flujoChart) flujoChart.destroy();
  if (egresosChart) egresosChart.destroy();

  // 1. FLUJO DE CAJA
  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const ingresos = [1500000, 1600000, 1450000, 1800000, 1550000, 1700000]; // Datos ficticios
  const egresos = [700000, 900000, 850000, 1100000, 750000, 950000]; // Datos ficticios

  const ctxFlujo = document.getElementById("chartFlujo").getContext("2d");
  flujoChart = new Chart(ctxFlujo, {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        {
          label: "Ingresos",
          data: ingresos,
          backgroundColor: "rgba(16, 185, 129, 0.8)", // secondary
        },
        {
          label: "Egresos",
          data: egresos,
          backgroundColor: "rgba(37, 99, 235, 0.8)", // primary
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // 2. EGRESOS POR CATEGORÍA
  const categorias = [
    "Mantenimiento",
    "Servicios",
    "Seguridad",
    "Aseo",
    "Administrativo",
    "Otro",
  ];
  const montos = [3500000, 2100000, 1800000, 1200000, 900000, 500000]; // Datos ficticios

  const ctxEgresos = document.getElementById("chartEgresos").getContext("2d");
  egresosChart = new Chart(ctxEgresos, {
    type: "doughnut",
    data: {
      labels: categorias,
      datasets: [
        {
          data: montos,
          backgroundColor: [
            "#10b981",
            "#2563eb",
            "#f59e0b",
            "#ef4444",
            "#a855f7",
            "#64748b",
          ],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

function loadTableMorosos() {
  const tableBody = document.getElementById("tableMorosos");
  tableBody.innerHTML = "";

  // Filtrar y ordenar morosos por deuda descendente
  const topMorosos = data.apartamentos
    .filter((a) => a.deuda > 0)
    .sort((a, b) => b.deuda - a.deuda)
    .slice(0, 5); // Tomar solo el top 5

  if (topMorosos.length === 0) {
    // Emoji eliminado
    tableBody.innerHTML =
      '<tr><td colspan="3" style="text-align: center;">No hay apartamentos morosos.</td></tr>';
    return;
  }

  topMorosos.forEach((apto) => {
    const row = tableBody.insertRow();
    row.insertCell().textContent = apto.apto;
    row.insertCell().textContent = apto.propietario;
    row.insertCell().textContent = formatCurrency(apto.deuda);
  });
}

// =======================================================
// GESTIÓN DE CARTERA
// =======================================================

function loadCartera() {
  const tableBody = document.getElementById("tableCartera");
  const filtro = document.getElementById("filtroCartera").value;
  const filtroAptoEl = document.getElementById("filtroApto");
  const filtroTorreEl = document.getElementById("filtroTorre");
  const filtroDesdeEl = document.getElementById("filtroDesde");
  const filtroHastaEl = document.getElementById("filtroHasta");

  const filtroApto = filtroAptoEl ? filtroAptoEl.value : "todos";
  const filtroTorre = filtroTorreEl ? filtroTorreEl.value : "todas";
  const filtroDesde =
    filtroDesdeEl && filtroDesdeEl.value ? new Date(filtroDesdeEl.value) : null;
  const filtroHasta =
    filtroHastaEl && filtroHastaEl.value ? new Date(filtroHastaEl.value) : null;

  tableBody.innerHTML = "";

  // Filtrar por estado, apartamento individual y/o torre
  const carteraFiltrada = data.apartamentos.filter((apto) => {
    // filtro por estado (todos/corriente/moroso)
    if (filtro !== "todos" && apto.estado !== filtro) return false;

    // filtro por apto
    if (filtroApto !== "todos" && apto.apto !== filtroApto) return false;

    // filtro por torre (primer carácter del apto)
    if (filtroTorre !== "todas" && apto.apto.charAt(0) !== filtroTorre)
      return false;

    return true;
  });

  carteraFiltrada.forEach((apto) => {
    const row = tableBody.insertRow();
    row.insertCell().textContent = apto.apto;
    row.insertCell().textContent = apto.propietario;
    row.insertCell().textContent = formatCurrency(apto.cuota);

    // Monto pagado es complejo, aquí lo simulamos para simplificar
    const pagadoSimulado = apto.estado === "corriente" ? apto.cuota * 10 : 0; // Si está al corriente, simula 10 cuotas pagadas
    row.insertCell().textContent = formatCurrency(pagadoSimulado);

    row.insertCell().textContent = formatCurrency(apto.deuda);

    // Calcular meses adeudados (si hay deuda)
    const mesesAdeudados =
      apto.cuota && apto.cuota > 0 && apto.deuda > 0
        ? Math.ceil(apto.deuda / apto.cuota)
        : 0;
    const mesesCell = row.insertCell();
    mesesCell.textContent = mesesAdeudados > 0 ? String(mesesAdeudados) : "-";

    const estadoCell = row.insertCell();
    const badgeClass =
      apto.estado === "corriente" ? "badge-success" : "badge-danger";
    const estadoText = apto.estado === "corriente" ? "Al Corriente" : "Moroso";
    estadoCell.innerHTML = `<span class="badge ${badgeClass}">${estadoText}</span>`;

    // --- Fecha Último Pago y Próximo Pago ---
    const pagosApto = data.transacciones
      .filter((t) => t.tipo === "pago" && t.apto === apto.apto)
      .map((t) => {
        const d = new Date(t.fecha);
        return isNaN(d) ? null : d;
      })
      .filter((d) => d !== null);

    let ultimoPagoText = "Sin pagos";
    let proximoPagoText = "—";

    if (pagosApto.length > 0) {
      // obtener la fecha más reciente
      const ultimo = new Date(
        Math.max.apply(
          null,
          pagosApto.map((d) => d.getTime())
        )
      );
      ultimoPagoText = formatDate(ultimo);

      // próximo pago: sumar 1 mes (aprox. misma fecha +1 mes)
      const prox = new Date(ultimo.getTime());
      prox.setMonth(prox.getMonth() + 1);
      proximoPagoText = formatDate(prox);
    }

    row.insertCell().textContent = ultimoPagoText;
    row.insertCell().textContent = proximoPagoText;
  });

  // Si se aplicó filtro de fechas, filtrar las filas de la tabla por la fecha del último pago
  if (filtroDesde || filtroHasta) {
    const rows = Array.from(tableBody.rows);
    rows.forEach((r) => {
      const ultimoPagoCell = r.cells[r.cells.length - 2]; // penúltima celda es Último Pago
      const fechaText = ultimoPagoCell ? ultimoPagoCell.textContent : "";
      if (!fechaText || fechaText === "Sin pagos") {
        r.remove();
        return;
      }
      const parts = fechaText.split("/");
      if (parts.length !== 3) return;
      const fecha = new Date(parts[2], parts[1] - 1, parts[0]);
      if (filtroDesde && fecha < filtroDesde) {
        r.remove();
        return;
      }
      if (filtroHasta && fecha > filtroHasta) {
        r.remove();
        return;
      }
    });
  }
}

function filtrarCartera() {
  loadCartera();
}

// =======================================================
// PAGOS Y GASTOS
// =======================================================

function loadPagosForms() {
  const selectAptos = document.getElementById("pagoApto");
  selectAptos.innerHTML = '<option value="">Seleccione...</option>';

  data.apartamentos.forEach((apto) => {
    const option = document.createElement("option");
    option.value = apto.apto;
    option.textContent = apto.apto + " - " + apto.propietario;
    selectAptos.appendChild(option);
  });

  // --- POBLAR filtros de cartera: apartamento y torre ---
  const filtroApto = document.getElementById("filtroApto");
  if (filtroApto) {
    filtroApto.innerHTML = '<option value="todos">Todos los Aptos</option>';
    data.apartamentos.forEach((apto) => {
      const opt = document.createElement("option");
      opt.value = apto.apto;
      opt.textContent = apto.apto + " - " + apto.propietario;
      filtroApto.appendChild(opt);
    });
  }

  const filtroTorre = document.getElementById("filtroTorre");
  if (filtroTorre) {
    const torres = Array.from(
      new Set(data.apartamentos.map((a) => a.apto.charAt(0)))
    ).sort();
    filtroTorre.innerHTML = '<option value="todas">Todas las Torres</option>';
    torres.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = "Torre " + t;
      filtroTorre.appendChild(opt);
    });
  }

  // Asignar listeners a los formularios
  document
    .getElementById("formPago")
    .addEventListener("submit", handleFormPago);
  document
    .getElementById("formGasto")
    .addEventListener("submit", handleFormGasto);
}

function handleFormPago(e) {
  e.preventDefault();
  (async function () {
    const apto = document.getElementById("pagoApto").value;
    const monto = parseInt(document.getElementById("pagoMonto").value);
    const fecha = document.getElementById("pagoFecha").value;
    const concepto = document.getElementById("pagoConcepto").value;

    const newPago = {
      tipo: "pago",
      fecha: fecha,
      detalle: concepto + " (" + apto + ")",
      monto: monto,
      apto: apto,
    };

    // Comprobante (opcional)
    const fileEl = document.getElementById("pagoComprobante");
    if (fileEl && fileEl.files && fileEl.files[0]) {
      try {
        const file = fileEl.files[0];
        const dataUrl = await readFileAsDataURL(file);
        newPago.comprobante = {
          name: file.name,
          type: file.type,
          dataUrl: dataUrl,
        };
      } catch (err) {
        console.error("Error leyendo comprobante:", err);
      }
    }

    data.transacciones.unshift(newPago); // Agregar al inicio para que se vea primero

    // --- Actualizar deuda y estado del apartamento ---
    const aptIndex = data.apartamentos.findIndex((a) => a.apto === apto);
    if (aptIndex !== -1) {
      const aptObj = data.apartamentos[aptIndex];
      // Reducir la deuda; no dejar deuda negativa
      const nuevaDeuda = Math.max(0, (aptObj.deuda || 0) - monto);
      aptObj.deuda = nuevaDeuda;
      // Actualizar estado según deuda
      aptObj.estado = nuevaDeuda > 0 ? "moroso" : "corriente";

      data.bitacora.unshift({
        fecha: new Date().toISOString().split("T")[0],
        usuario: data.currentUser.username,
        accion: `Pago registrado ${formatCurrency(
          monto
        )} para ${apto} - Deuda restante ${formatCurrency(nuevaDeuda)}`,
      });
    } else {
      // Si no se encuentra el apto, aun así registrar en bitácora
      data.bitacora.unshift({
        fecha: new Date().toISOString().split("T")[0],
        usuario: data.currentUser.username,
        accion: `Pago registrado ${formatCurrency(
          monto
        )} para ${apto} (apartamento no encontrado en cartera)`,
      });
    }

    // Alerta mejorada
    showNotification(
      `Pago de ${formatCurrency(
        monto
      )} registrado para el Apto ${apto}. Deuda actual: ${
        aptIndex !== -1
          ? formatCurrency(data.apartamentos[aptIndex].deuda)
          : "-"
      }`
    );

    e.target.reset();

    // Actualizar todas las secciones relevantes
    updateStats();
    loadTransacciones();
    loadBitacora();
    loadCartera();
    // Actualizar Top Morosos en el Dashboard
    loadTableMorosos();
  })();
}

function handleFormGasto(e) {
  e.preventDefault();
  (async function () {
    const categoria = document.getElementById("gastoCategoria").value;
    const monto = parseInt(document.getElementById("gastoMonto").value);
    const fecha = document.getElementById("gastoFecha").value;
    const descripcion = document.getElementById("gastoDescripcion").value;

    const newGasto = {
      tipo: "gasto",
      fecha: fecha,
      detalle: descripcion,
      monto: monto, // Gastos registrados como monto positivo
      categoria: categoria,
    };

    // Comprobante (opcional)
    const fileEl = document.getElementById("gastoComprobante");
    if (fileEl && fileEl.files && fileEl.files[0]) {
      try {
        const file = fileEl.files[0];
        const dataUrl = await readFileAsDataURL(file);
        newGasto.comprobante = {
          name: file.name,
          type: file.type,
          dataUrl: dataUrl,
        };
      } catch (err) {
        console.error("Error leyendo comprobante:", err);
      }
    }

    data.transacciones.unshift(newGasto);

    // Registrar en bitácora
    data.bitacora.unshift({
      fecha: new Date().toISOString().split("T")[0],
      usuario: data.currentUser.username,
      accion: `Gasto registrado ${formatCurrency(
        monto
      )} - ${categoria}: ${descripcion}`,
    });

    // Alerta mejorada
    showNotification(
      `Gasto de ${formatCurrency(
        monto
      )} registrado en la categoría ${categoria}.`,
      "danger"
    );

    e.target.reset();

    updateStats();
    loadTransacciones();
    loadBitacora();
    // Actualizar Top Morosos en el Dashboard (por si un gasto impacta deuda o vista)
    loadTableMorosos();
  })();
}

function loadTransacciones() {
  const tableBody = document.getElementById("tableTransacciones");
  const filtro = document.getElementById("filtroTransacciones").value;
  tableBody.innerHTML = "";

  const transaccionesFiltradas = data.transacciones
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Ordenar por fecha descendente
    .filter((t) => {
      if (filtro === "todas") return true;
      return t.tipo === filtro.slice(0, -1); // 'pagos' -> 'pago', 'gastos' -> 'gasto'
    });

  transaccionesFiltradas.forEach((t) => {
    const row = tableBody.insertRow();
    row.insertCell().textContent = t.fecha;

    const tipoCell = row.insertCell();
    const badgeClass = t.tipo === "pago" ? "badge-success" : "badge-danger";
    const tipoText = t.tipo === "pago" ? "Ingreso" : "Egreso";
    tipoCell.innerHTML = `<span class="badge ${badgeClass}">${tipoText}</span>`;

    row.insertCell().textContent = t.detalle;

    const montoCell = row.insertCell();
    const montoAbs = Math.abs(t.monto);
    montoCell.textContent = formatCurrency(montoAbs);
    montoCell.style.color =
      t.tipo === "pago" ? "var(--secondary)" : "var(--danger)";
    montoCell.style.fontWeight = "600";
    // --- Columna Comprobante ---
    const compCell = row.insertCell();
    if (t.comprobante) {
      const c = t.comprobante;
      // Imagen -> mostrar miniatura clicable
      if (c.type && c.type.startsWith("image/")) {
        const a = document.createElement("a");
        a.href = c.dataUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        const img = document.createElement("img");
        img.src = c.dataUrl;
        img.alt = c.name || "Comprobante";
        img.style.maxWidth = "80px";
        img.style.maxHeight = "60px";
        img.style.borderRadius = "6px";
        img.style.objectFit = "cover";
        a.appendChild(img);
        compCell.appendChild(a);
      } else {
        // Otros tipos (ej. PDF) -> mostrar enlace
        const a = document.createElement("a");
        a.href = c.dataUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = c.name || "Ver comprobante";
        a.style.color = "var(--primary)";
        compCell.appendChild(a);
      }
    } else {
      compCell.textContent = "-";
      compCell.style.color = "var(--text-light)";
    }
  });
}

function filtrarTransacciones() {
  loadTransacciones();
}

// =======================================================
// CENSO
// =======================================================

function loadCenso() {
  const tableBody = document.getElementById("tableCenso");
  tableBody.innerHTML = "";

  data.apartamentos.forEach((apto) => {
    const row = tableBody.insertRow();
    row.insertCell().textContent = apto.apto;
    row.insertCell().textContent = apto.propietario;
    row.insertCell().textContent = apto.telefono;
    row.insertCell().textContent = apto.email;
    row.insertCell().textContent = apto.residentes;
    const actionsCell = row.insertCell();
    // Edit button
    const btnEdit = document.createElement("button");
    btnEdit.className = "btn-small";
    btnEdit.style.marginRight = "8px";
    btnEdit.textContent = "Editar";
    btnEdit.onclick = () => openResidentModal("edit", apto.apto);
    actionsCell.appendChild(btnEdit);

    // Delete button
    const btnDel = document.createElement("button");
    btnDel.className = "btn-small btn-danger";
    btnDel.textContent = "Eliminar";
    btnDel.onclick = () => deleteResident(apto.apto);
    actionsCell.appendChild(btnDel);
  });
}

/**
 * Abre el modal para agregar o editar un residente.
 * @param {'add'|'edit'} mode
 * @param {string} [apto]
 */
function openResidentModal(mode, apto) {
  const modal = document.getElementById("residentModal");
  const title = document.getElementById("residentModalTitle");
  const originalApto = document.getElementById("residentOriginalApto");
  const inputApto = document.getElementById("residentApto");
  const inputProp = document.getElementById("residentPropietario");
  const inputTel = document.getElementById("residentTelefono");
  const inputEmail = document.getElementById("residentEmail");
  const inputRes = document.getElementById("residentResidentes");
  const inputCuota = document.getElementById("residentCuota");

  if (mode === "add") {
    title.textContent = "Agregar Residente";
    originalApto.value = "";
    inputApto.value = "";
    inputProp.value = "";
    inputTel.value = "";
    inputEmail.value = "";
    inputRes.value = "";
    inputCuota.value = data.config.cuotaBase || "";
  } else if (mode === "edit") {
    title.textContent = "Editar Residente";
    const found = data.apartamentos.find((a) => a.apto === apto);
    if (!found) return showNotification("Apartamento no encontrado", "danger");
    originalApto.value = found.apto;
    inputApto.value = found.apto;
    inputProp.value = found.propietario || "";
    inputTel.value = found.telefono || "";
    inputEmail.value = found.email || "";
    inputRes.value = found.residentes || "";
    inputCuota.value = found.cuota || data.config.cuotaBase || "";
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function closeResidentModal() {
  const modal = document.getElementById("residentModal");
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
}

function handleFormResident(e) {
  e.preventDefault();
  const originalApto = document
    .getElementById("residentOriginalApto")
    .value.trim();
  const apto = document.getElementById("residentApto").value.trim();
  const propietario = document
    .getElementById("residentPropietario")
    .value.trim();
  const telefono = document.getElementById("residentTelefono").value.trim();
  const email = document.getElementById("residentEmail").value.trim();
  const residentes =
    parseInt(document.getElementById("residentResidentes").value) || 0;
  const cuota =
    parseInt(document.getElementById("residentCuota").value) ||
    data.config.cuotaBase;

  if (!apto || !propietario) {
    return showNotification("Apto y Propietario son obligatorios", "danger");
  }

  // Si es edición
  if (originalApto) {
    const idx = data.apartamentos.findIndex((a) => a.apto === originalApto);
    if (idx === -1) return showNotification("Registro no encontrado", "danger");

    // Si cambió el apto a uno ya existente y distinto, impedirlo
    if (
      apto !== originalApto &&
      data.apartamentos.some((a) => a.apto === apto)
    ) {
      return showNotification(
        "Ya existe un apartamento con ese identificador",
        "danger"
      );
    }

    data.apartamentos[idx] = Object.assign({}, data.apartamentos[idx], {
      apto,
      propietario,
      telefono,
      email,
      residentes,
      cuota,
    });

    data.bitacora.unshift({
      fecha: new Date().toISOString().split("T")[0],
      usuario: data.currentUser.username,
      accion: `Edición de residente ${apto}`,
    });

    showNotification(`Residente ${apto} actualizado.`);
  } else {
    // Agregar nuevo, verificar duplicado
    if (data.apartamentos.some((a) => a.apto === apto)) {
      return showNotification(
        "Ya existe un apartamento con ese identificador",
        "danger"
      );
    }

    const nuevo = {
      apto: apto,
      propietario: propietario,
      telefono: telefono,
      email: email,
      residentes: residentes,
      cuota: cuota,
      estado: "corriente",
      deuda: 0,
    };
    data.apartamentos.unshift(nuevo);

    data.bitacora.unshift({
      fecha: new Date().toISOString().split("T")[0],
      usuario: data.currentUser.username,
      accion: `Creación de residente ${apto}`,
    });

    showNotification(`Residente ${apto} agregado.`);
  }

  closeResidentModal();
  loadCenso();
  loadPagosForms();
  loadCartera();
  loadBitacora();
}

function deleteResident(apto) {
  if (
    !confirm(
      `¿Eliminar el apartamento ${apto}? Esta acción no se puede deshacer.`
    )
  )
    return;
  const idx = data.apartamentos.findIndex((a) => a.apto === apto);
  if (idx === -1) return showNotification("Registro no encontrado", "danger");
  data.apartamentos.splice(idx, 1);

  data.bitacora.unshift({
    fecha: new Date().toISOString().split("T")[0],
    usuario: data.currentUser.username,
    accion: `Eliminación de residente ${apto}`,
  });

  showNotification(`Residente ${apto} eliminado.`, "warning");
  loadCenso();
  loadPagosForms();
  loadCartera();
  loadBitacora();
}

function loadVehiculos() {
  const tableBody = document.getElementById("tableVehiculos");
  tableBody.innerHTML = "";

  data.vehiculos.forEach((v) => {
    const row = tableBody.insertRow();
    row.insertCell().textContent = v.apto;
    row.insertCell().textContent = v.tipo;
    row.insertCell().textContent = v.marca;
    row.insertCell().textContent = v.placa;
    const actionsCell = row.insertCell();
    // Edit
    const btnEdit = document.createElement("button");
    btnEdit.className = "btn-small";
    btnEdit.style.marginRight = "8px";
    btnEdit.textContent = "Editar";
    btnEdit.onclick = () => openVehicleModal("edit", v.placa);
    actionsCell.appendChild(btnEdit);
    // Delete
    const btnDel = document.createElement("button");
    btnDel.className = "btn-small btn-danger";
    btnDel.textContent = "Eliminar";
    btnDel.onclick = () => deleteVehicle(v.placa);
    actionsCell.appendChild(btnDel);
  });
}

function openVehicleModal(mode, placa) {
  const modal = document.getElementById("vehicleModal");
  const title = document.getElementById("vehicleModalTitle");
  const originalPlaca = document.getElementById("vehicleOriginalPlaca");
  const inputApto = document.getElementById("vehicleApto");
  const inputTipo = document.getElementById("vehicleTipo");
  const inputMarca = document.getElementById("vehicleMarca");
  const inputPlaca = document.getElementById("vehiclePlaca");

  if (mode === "add") {
    title.textContent = "Agregar Vehículo";
    originalPlaca.value = "";
    inputApto.value = "";
    inputTipo.value = "";
    inputMarca.value = "";
    inputPlaca.value = "";
  } else if (mode === "edit") {
    title.textContent = "Editar Vehículo";
    const found = data.vehiculos.find((v) => v.placa === placa);
    if (!found) return showNotification("Vehículo no encontrado", "danger");
    originalPlaca.value = found.placa;
    inputApto.value = found.apto || "";
    inputTipo.value = found.tipo || "";
    inputMarca.value = found.marca || "";
    inputPlaca.value = found.placa || "";
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function closeVehicleModal() {
  const modal = document.getElementById("vehicleModal");
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
}

function handleFormVehicle(e) {
  e.preventDefault();
  const originalPlaca = document
    .getElementById("vehicleOriginalPlaca")
    .value.trim();
  const apto = document.getElementById("vehicleApto").value.trim();
  const tipo = document.getElementById("vehicleTipo").value.trim();
  const marca = document.getElementById("vehicleMarca").value.trim();
  const placa = document.getElementById("vehiclePlaca").value.trim();

  if (!apto || !placa) {
    return showNotification("Apto y Placa son obligatorios", "danger");
  }

  if (originalPlaca) {
    const idx = data.vehiculos.findIndex((v) => v.placa === originalPlaca);
    if (idx === -1) return showNotification("Registro no encontrado", "danger");
    // If placa changed to an existing one
    if (
      placa !== originalPlaca &&
      data.vehiculos.some((v) => v.placa === placa)
    ) {
      return showNotification("Ya existe un vehículo con esa placa", "danger");
    }

    data.vehiculos[idx] = Object.assign({}, data.vehiculos[idx], {
      apto,
      tipo,
      marca,
      placa,
    });

    data.bitacora.unshift({
      fecha: new Date().toISOString().split("T")[0],
      usuario: data.currentUser.username,
      accion: `Edición de vehículo ${placa}`,
    });

    showNotification(`Vehículo ${placa} actualizado.`);
  } else {
    if (data.vehiculos.some((v) => v.placa === placa)) {
      return showNotification("Ya existe un vehículo con esa placa", "danger");
    }

    const nuevo = { apto, tipo, marca, placa };
    data.vehiculos.unshift(nuevo);

    data.bitacora.unshift({
      fecha: new Date().toISOString().split("T")[0],
      usuario: data.currentUser.username,
      accion: `Registro de vehículo ${placa}`,
    });

    showNotification(`Vehículo ${placa} agregado.`);
  }

  closeVehicleModal();
  loadVehiculos();
  loadBitacora();
}

function deleteVehicle(placa) {
  if (!confirm(`¿Eliminar el vehículo con placa ${placa}?`)) return;
  const idx = data.vehiculos.findIndex((v) => v.placa === placa);
  if (idx === -1) return showNotification("Registro no encontrado", "danger");
  data.vehiculos.splice(idx, 1);

  data.bitacora.unshift({
    fecha: new Date().toISOString().split("T")[0],
    usuario: data.currentUser.username,
    accion: `Eliminación de vehículo ${placa}`,
  });

  showNotification(`Vehículo ${placa} eliminado.`, "warning");
  loadVehiculos();
  loadBitacora();
}

// =======================================================
// CONFIGURACIÓN
// =======================================================

function loadConfigForm() {
  document.getElementById("cuotaBase").value = data.config.cuotaBase;
  document.getElementById("tasaInteres").value = data.config.tasaInteres;

  document
    .getElementById("formConfigCuota")
    .addEventListener("submit", handleFormConfigCuota);
}

function handleFormConfigCuota(e) {
  e.preventDefault();
  const cuotaBase = parseInt(document.getElementById("cuotaBase").value);
  const tasaInteres = parseFloat(document.getElementById("tasaInteres").value);

  data.config.cuotaBase = cuotaBase;
  data.config.tasaInteres = tasaInteres;

  // Simular que todos los apartamentos se actualizan con la nueva cuota
  data.apartamentos.forEach((apto) => (apto.cuota = cuotaBase));

  // Alerta mejorada
  showNotification(
    "Configuración de cuotas guardada exitosamente. La cuota base de los apartamentos ha sido actualizada."
  );

  data.bitacora.unshift({
    fecha: new Date().toISOString().split("T")[0],
    usuario: data.currentUser.username,
    accion: `Actualización de Configuración: Cuota Base a ${formatCurrency(
      cuotaBase
    )}`,
  });
  loadBitacora();
  loadCartera(); // Recargar cartera con la nueva cuota
}

function loadBitacora() {
  const tableBody = document.getElementById("tableBitacora");
  tableBody.innerHTML = "";

  // Mostrar solo los últimos 20
  const bitacoraReciente = data.bitacora.slice(0, 20);

  bitacoraReciente.forEach((log) => {
    const row = tableBody.insertRow();
    row.insertCell().textContent = log.fecha;
    row.insertCell().textContent = log.usuario;
    row.insertCell().textContent = log.accion;
  });
}

// =======================================================
// REPORTES Y EXPORTACIÓN (Funciones de simulación)
// =======================================================

function exportarReporte(tipo) {
  const doc = new window.jspdf.jsPDF();
  doc.text(`Reporte de ${tipo.toUpperCase()}`, 10, 10);
  doc.text(
    "Este es un reporte simulado de la aplicación CondoManager Pro.",
    10,
    20
  );
  doc.save(`reporte-${tipo}-${new Date().toISOString().split("T")[0]}.pdf`);

  // Alerta mejorada
  showNotification(`Reporte de ${tipo.toUpperCase()} generado (simulación).`);
}

function exportarRespaldo() {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute(
    "download",
    `backup_CondoManagerPro_${new Date().toISOString().split("T")[0]}.json`
  );
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();

  // Alerta mejorada
  showNotification("Respaldo JSON descargado (simulación).");
}

// =======================================================
// UTILITIES
// =======================================================

/**
 * Formatea una Date a dd/mm/yyyy.
 * @param {Date} d
 * @returns {string}
 */
function formatDate(d) {
  if (!(d instanceof Date) || isNaN(d)) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Formatea un número como moneda (COP - Peso Colombiano).
 * @param {number} amount - El monto a formatear.
 * @returns {string} El monto formateado.
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
}

// =======================================================
// INICIO DE LA APLICACIÓN
// =======================================================

// La aplicación se inicializa directamente
window.addEventListener("load", initApp);
