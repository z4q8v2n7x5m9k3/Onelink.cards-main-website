const planData = {
    essential: {
        name: 'Essential',
        description: 'Smart Business Presence.',
        setup: 5999,
        care: { '3-month': 2499, '6-month': 4499, '12-month': 7999 }
    },
    signature: {
        name: 'Signature',
        description: 'Smart Business Growth.',
        setup: 9999,
        care: { '3-month': 3999, '6-month': 6999, '12-month': 12499 }
    },
    elite: {
        name: 'Elite',
        description: 'Smart Business Management.',
        setup: 16999,
        care: { '3-month': 6499, '6-month': 11499, '12-month': 19999 }
    }
};

const careLabels = {
    '3-month': '3 Months',
    '6-month': '6 Months',
    '12-month': '12 Months'
};

const els = {
    billingType: document.getElementById('billing-type'),
    invNo: document.getElementById('inv-number'),
    invStatus: document.getElementById('inv-status'),
    invDate: document.getElementById('inv-date'),
    invDue: document.getElementById('inv-due-date'),
    cBusiness: document.getElementById('client-business'),
    cName: document.getElementById('client-name'),
    cContact: document.getElementById('client-contact'),
    cEmail: document.getElementById('client-email'),
    cGstin: document.getElementById('client-gstin'),
    cAddress: document.getElementById('client-address'),
    cState: document.getElementById('client-state'),
    placeOfSupply: document.getElementById('place-of-supply'),
    plan: document.getElementById('plan-name'),
    care: document.getElementById('care-duration'),
    customPlanName: document.getElementById('custom-plan-name'),
    customSetup: document.getElementById('custom-setup-price'),
    customCare: document.getElementById('custom-care-price'),
    setupDiscountPct: document.getElementById('setup-discount-percent'),
    careDiscountPct: document.getElementById('care-discount-percent'),
    sacCode: document.getElementById('sac-code'),
    planDesc: document.getElementById('plan-desc'),
    pMode: document.getElementById('payment-structure'),
    amountPaid: document.getElementById('amount-paid'),
    discountType: document.getElementById('discount-type'),
    discount: document.getElementById('discount-amount'),
    discountLabel: document.getElementById('discount-label'),
    gstPct: document.getElementById('gst-percent'),
    invoiceNote: document.getElementById('invoice-note')
};

const disp = {
    page: document.getElementById('invoice-page'),
    invoiceTitle: document.getElementById('display-invoice-title'),
    companyLine: document.getElementById('display-company-line'),
    supplierBlock: document.getElementById('supplier-block'),
    invNo: document.getElementById('display-inv-no'),
    invDate: document.getElementById('display-inv-date'),
    invDue: document.getElementById('display-inv-due'),
    status: document.getElementById('display-status'),
    cBusiness: document.getElementById('display-client-business'),
    cName: document.getElementById('display-client-name'),
    cContact: document.getElementById('display-client-contact'),
    cGstin: document.getElementById('display-client-gstin'),
    cGstinCont: document.getElementById('display-client-gstin-container'),
    cAddress: document.getElementById('display-client-address'),
    cState: document.getElementById('display-client-state'),
    cStateCont: document.getElementById('display-client-state-container'),
    placeOfSupply: document.getElementById('display-place-supply'),
    placeOfSupplyCont: document.getElementById('display-place-supply-container'),
    planName: document.getElementById('display-plan-name'),
    planDesc: document.getElementById('display-plan-desc'),
    careMode: document.getElementById('display-billing-mode'),
    sac: document.getElementById('display-sac'),
    sacCont: document.getElementById('display-sac-container'),
    setupAmount: document.getElementById('display-setup-amount'),
    setupDiscountRow: document.getElementById('display-setup-discount-row'),
    setupDiscountPct: document.getElementById('display-setup-discount-percent'),
    setupDiscountAmount: document.getElementById('display-setup-discount-amount'),
    careLabel: document.getElementById('display-care-label'),
    careAmount: document.getElementById('display-care-amount'),
    careDiscountRow: document.getElementById('display-care-discount-row'),
    careDiscountPct: document.getElementById('display-care-discount-percent'),
    careDiscountAmount: document.getElementById('display-care-discount-amount'),
    baseAmount: document.getElementById('display-base-amount'),
    discountRow: document.getElementById('row-discount'),
    discount: document.getElementById('display-discount'),
    taxable: document.getElementById('display-taxable'),
    cgstPct: document.getElementById('display-cgst-percent'),
    cgstAmt: document.getElementById('display-cgst-amount'),
    cgstRow: document.getElementById('row-cgst'),
    sgstPct: document.getElementById('display-sgst-percent'),
    sgstAmt: document.getElementById('display-sgst-amount'),
    sgstRow: document.getElementById('row-sgst'),
    igstPct: document.getElementById('display-igst-percent'),
    igstAmt: document.getElementById('display-igst-amount'),
    igstRow: document.getElementById('row-igst'),
    grandTotal: document.getElementById('display-grand-total'),
    labelPaid: document.getElementById('label-paid'),
    paidAmt: document.getElementById('display-paid-amount'),
    balance: document.getElementById('display-balance-due'),
    scopeNote: document.getElementById('display-scope-note'),
    scopeNoteText: document.getElementById('display-scope-note-text'),
    careRenewalText: document.getElementById('display-care-renewal-text'),
    amountWords: document.getElementById('display-amount-words'),
    footerTerms: document.getElementById('display-footer-terms'),
    footerNote: document.getElementById('display-footer-note')
};

const roundTo2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;
const fmt = (num) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(roundTo2(num));
const fmtDetailed = (num) => new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(roundTo2(num));

function getCurrentPlan() {
    const isCustom = els.plan.value === 'custom';
    if (isCustom) {
        return {
            name: els.customPlanName.value.trim() || 'Custom OneLink Plan',
            description: els.planDesc.value.trim() || 'Custom OneLink business solution.',
            setup: Math.max(Number(els.customSetup.value) || 0, 0),
            care: Math.max(Number(els.customCare.value) || 0, 0)
        };
    }

    const plan = planData[els.plan.value] || planData.signature;
    return {
        name: plan.name,
        description: els.planDesc.value.trim() || plan.description,
        setup: plan.setup,
        care: plan.care[els.care.value] || plan.care['6-month']
    };
}

function init() {
    const today = new Date();
    const due = new Date(today);
    due.setDate(today.getDate() + 7);
    els.invDate.value = today.toISOString().split('T')[0];
    els.invDue.value = due.toISOString().split('T')[0];

    Object.values(els).forEach((element) => {
        element.addEventListener('input', renderInvoice);
        element.addEventListener('change', renderInvoice);
    });

    els.plan.addEventListener('change', updateCustomFields);
    els.discountType.addEventListener('change', updateDiscountLabel);
    els.billingType.addEventListener('change', updateBillingMode);
    els.invStatus.addEventListener('change', updatePaymentFields);
    document.getElementById('download-btn').addEventListener('click', downloadPDF);
    document.getElementById('whatsapp-btn').addEventListener('click', sendWhatsApp);
    document.getElementById('email-btn').addEventListener('click', sendEmail);

    applyQuotationFromQuery();
    updateCustomFields();
    updateDiscountLabel();
    updateBillingMode();
    updatePaymentFields();
    renderInvoice();
}

function updateBillingMode() {
    const isGst = els.billingType.value === 'gst';
    document.querySelectorAll('.gst-only-field').forEach((element) => {
        element.style.display = isGst ? '' : 'none';
    });
    els.gstPct.value = isGst ? '18' : '0';
    renderInvoice();
}

function updatePaymentFields() {
    document.querySelectorAll('.partially-paid-field').forEach((element) => {
        element.style.display = els.invStatus.value === 'Partially Paid' ? '' : 'none';
    });
    renderInvoice();
}

function updateCustomFields() {
    const custom = els.plan.value === 'custom';
    document.querySelector('.custom-plan-fields').style.display = custom ? 'block' : 'none';
    if (!custom && !els.planDesc.value.trim()) {
        els.planDesc.value = planData[els.plan.value].description;
    }
    renderInvoice();
}

function updateDiscountLabel() {
    els.discountLabel.textContent = els.discountType.value === 'percent' ? 'Discount (%)' : 'Discount (₹)';
}

function applyQuotationFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const planId = params.get('plan');
    const careId = params.get('care');
    const discountMode = params.get('discountMode');

    if (planId && (planData[planId] || planId === 'custom')) els.plan.value = planId;
    if (careId && careLabels[careId]) els.care.value = careId;
    els.cName.value = params.get('client') || '';
    els.planDesc.value = params.get('description') || '';
    if (params.has('gst')) {
        els.billingType.value = params.get('gst') === '0' ? 'non-gst' : 'gst';
    }
    els.discountType.value = discountMode === 'percentage' ? 'percent' : 'amount';
    els.discount.value = params.get('discountValue') || '0';

    if (planId === 'custom') {
        els.customPlanName.value = params.get('customName') || 'Custom OneLink Plan';
        els.customSetup.value = params.get('setup') || '0';
        els.customCare.value = params.get('careAmount') || '0';
    }
}

function renderInvoice() {
    const isGst = els.billingType.value === 'gst';
    const money = isGst ? fmtDetailed : fmt;
    const plan = getCurrentPlan();
    const setupDiscountPercent = Math.min(Math.max(Number(els.setupDiscountPct.value) || 0, 0), 100);
    const careDiscountPercent = Math.min(Math.max(Number(els.careDiscountPct.value) || 0, 0), 100);
    const setupDiscount = roundTo2(plan.setup * setupDiscountPercent / 100);
    const careDiscount = roundTo2(plan.care * careDiscountPercent / 100);
    const lineDiscount = roundTo2(setupDiscount + careDiscount);
    const subtotal = roundTo2(plan.setup + plan.care - lineDiscount);
    const rawDiscount = Math.max(Number(els.discount.value) || 0, 0);
    const additionalDiscount = roundTo2(els.discountType.value === 'percent'
        ? subtotal * Math.min(rawDiscount, 100) / 100
        : Math.min(rawDiscount, subtotal));
    const totalDiscount = roundTo2(lineDiscount + additionalDiscount);
    const taxable = roundTo2(Math.max(subtotal - additionalDiscount, 0));
    const gstPercent = isGst ? 18 : 0;
    const gst = roundTo2(taxable * gstPercent / 100);
    const total = roundTo2(taxable + gst);
    const taxState = els.placeOfSupply.value.trim() || els.cState.value.trim();
    const normalizedState = taxState.toLowerCase().replace(/[^a-z0-9]/g, '');
    const isJammuKashmir = normalizedState.includes('jammu') || normalizedState.includes('jandk') || normalizedState === '01';
    const cgst = isGst && isJammuKashmir ? roundTo2(gst / 2) : 0;
    const sgst = isGst && isJammuKashmir ? roundTo2(gst - cgst) : 0;
    const igst = isGst && !isJammuKashmir ? gst : 0;

    disp.page.classList.toggle('gst-invoice', isGst);
    disp.page.classList.toggle('non-gst-invoice', !isGst);
    disp.invoiceTitle.textContent = isGst ? 'TAX INVOICE' : 'BILL';
    disp.companyLine.textContent = isGst ? 'A product by KRIYON GROUP PRIVATE LIMITED' : 'Digital business billing';
    disp.supplierBlock.style.display = isGst ? 'block' : 'none';

    disp.invNo.textContent = els.invNo.value || '-';
    disp.invDate.textContent = formatDate(els.invDate.value);
    disp.invDue.textContent = formatDate(els.invDue.value);
    disp.status.textContent = els.invStatus.value;
    disp.status.className = 'inv-status';
    if (els.invStatus.value === 'Paid') disp.status.classList.add('paid');
    if (els.invStatus.value === 'Partially Paid') disp.status.classList.add('partially');
    if (els.invStatus.value === 'Overdue') disp.status.classList.add('overdue');

    disp.cBusiness.textContent = els.cBusiness.value;
    disp.cBusiness.style.display = els.cBusiness.value ? 'block' : 'none';
    disp.cName.textContent = els.cName.value || 'Client Name';
    disp.cContact.textContent = els.cContact.value;
    disp.cGstinCont.style.display = isGst && els.cGstin.value ? 'block' : 'none';
    disp.cGstin.textContent = els.cGstin.value;
    disp.cAddress.textContent = els.cAddress.value;
    disp.cStateCont.style.display = isGst && els.cState.value.trim() ? 'block' : 'none';
    disp.cState.textContent = els.cState.value.trim();
    disp.placeOfSupplyCont.style.display = isGst ? 'block' : 'none';
    disp.placeOfSupply.textContent = els.placeOfSupply.value.trim() || els.cState.value.trim() || 'Not provided';

    disp.planName.textContent = plan.name;
    disp.planDesc.textContent = plan.description;
    disp.careMode.textContent = `Billing Period: ${careLabels[els.care.value]} Platform Care`;
    disp.sacCont.style.display = isGst && els.sacCode.value.trim() ? 'block' : 'none';
    disp.sac.textContent = els.sacCode.value.trim();
    disp.setupAmount.textContent = `₹${money(plan.setup)}`;
    disp.setupDiscountRow.style.display = setupDiscount > 0 ? 'flex' : 'none';
    disp.setupDiscountPct.textContent = fmt(setupDiscountPercent);
    disp.setupDiscountAmount.textContent = money(setupDiscount);
    disp.careLabel.textContent = `Platform Care · ${careLabels[els.care.value]}`;
    disp.careAmount.textContent = `₹${money(plan.care)}`;
    disp.careDiscountRow.style.display = careDiscount > 0 ? 'flex' : 'none';
    disp.careDiscountPct.textContent = fmt(careDiscountPercent);
    disp.careDiscountAmount.textContent = money(careDiscount);
    disp.baseAmount.textContent = `₹${money(subtotal)}`;

    disp.discountRow.style.display = totalDiscount > 0 ? 'flex' : 'none';
    disp.discount.textContent = money(totalDiscount);
    disp.taxable.textContent = money(taxable);
    disp.cgstPct.textContent = fmt(gstPercent / 2);
    disp.cgstAmt.textContent = money(cgst);
    disp.cgstRow.style.display = cgst > 0 ? 'flex' : 'none';
    disp.sgstPct.textContent = fmt(gstPercent / 2);
    disp.sgstAmt.textContent = money(sgst);
    disp.sgstRow.style.display = sgst > 0 ? 'flex' : 'none';
    disp.igstPct.textContent = fmt(gstPercent);
    disp.igstAmt.textContent = money(igst);
    disp.igstRow.style.display = igst > 0 ? 'flex' : 'none';
    disp.grandTotal.textContent = money(total);
    disp.amountWords.textContent = amountToWords(total);

    const status = els.invStatus.value;
    const paidAmount = status === 'Paid'
        ? total
        : status === 'Partially Paid'
            ? Math.min(Math.max(Number(els.amountPaid.value) || 0, 0), total)
            : 0;
    disp.labelPaid.textContent = 'Amount Paid:';
    disp.paidAmt.textContent = money(paidAmount);
    disp.balance.textContent = money(roundTo2(total - paidAmount));

    disp.scopeNote.style.display = els.invoiceNote.value.trim() ? 'block' : 'none';
    disp.scopeNoteText.textContent = els.invoiceNote.value.trim();
    disp.careRenewalText.textContent = `${careLabels[els.care.value]} Platform Care is included in this invoice. After this period ends, Platform Care must be renewed to continue ongoing support, updates and maintenance at the then-applicable plan price. Design & Development is a one-time fee and does not renew.`;
    disp.footerTerms.textContent = isGst
        ? 'By proceeding with this invoice, you agree to our Terms & Conditions. For details, visit kriyon.com/legal'
        : 'By proceeding with this bill, you agree to the applicable service terms.';
    disp.footerNote.textContent = isGst
        ? 'This is a computer-generated tax invoice and does not require a physical signature.'
        : 'This is a computer generated invoice and does not require a physical signature.';
}

function formatDate(value) {
    if (!value) return '-';
    const date = new Date(`${value}T00:00:00`);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
}

function numberToWords(num) {
    if (num === 0) return 'Rupees Zero Only';
    const ones = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const words = (value) => {
        if (value < 20) return ones[value];
        if (value < 100) return tens[Math.floor(value / 10)] + (value % 10 ? ` ${ones[value % 10]}` : ' ');
        if (value < 1000) return `${ones[Math.floor(value / 100)]}Hundred ${value % 100 ? `and ${words(value % 100)}` : ''}`;
        if (value < 100000) return `${words(Math.floor(value / 1000))}Thousand ${value % 1000 ? words(value % 1000) : ''}`;
        if (value < 10000000) return `${words(Math.floor(value / 100000))}Lakh ${value % 100000 ? words(value % 100000) : ''}`;
        return `${words(Math.floor(value / 10000000))}Crore ${value % 10000000 ? words(value % 10000000) : ''}`;
    };
    return `Rupees ${words(num).trim()} Only`;
}

function amountToWords(amount) {
    const totalPaise = Math.round(roundTo2(amount) * 100);
    const rupees = Math.floor(totalPaise / 100);
    const paise = totalPaise % 100;
    const rupeeWords = numberToWords(rupees).replace(/^Rupees\s+/, '').replace(/\s+Only$/, '');
    const paiseWords = paise > 0
        ? ` and ${numberToWords(paise).replace(/^Rupees\s+/, '').replace(/\s+Only$/, '')} Paise`
        : '';
    return `Indian Rupees ${rupeeWords}${paiseWords} Only`;
}

function validateTaxInvoice() {
    if (els.billingType.value !== 'gst') return true;
    const missing = [];
    if (!els.cState.value.trim()) missing.push('Billing State');
    if (!els.placeOfSupply.value.trim()) missing.push('Place of Supply');
    if (missing.length === 0) return true;
    window.alert(`Complete these GST invoice fields before downloading:\n• ${missing.join('\n• ')}`);
    return false;
}

function downloadPDF() {
    if (!validateTaxInvoice()) return;
    const invoiceNo = els.invNo.value || 'Invoice';
    const client = els.cName.value || 'Client';
    html2pdf().set({
        margin: 0,
        filename: `${invoiceNo}_OneLink_${client.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(document.getElementById('invoice-page')).save();
}

function sendWhatsApp() {
    const client = els.cName.value || 'Client';
    const phoneRaw = els.cContact.value.replace(/[^0-9]/g, '');
    const phone = phoneRaw.length === 10 ? `91${phoneRaw}` : phoneRaw;
    const documentName = els.billingType.value === 'gst' ? 'tax invoice' : 'bill';
    const message = `Hi ${client},\n\nYour OneLink ${documentName} is ready.\n\nInvoice: ${els.invNo.value || 'INV-001'}\nAmount: ₹${disp.grandTotal.textContent}\nStatus: ${els.invStatus.value}\n\nThank you,\nKriyon Group Pvt. Ltd.`;
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`, '_blank');
    setTimeout(downloadPDF, 800);
}

function sendEmail() {
    const client = els.cName.value || 'Client';
    const documentName = els.billingType.value === 'gst' ? 'Tax Invoice' : 'Bill';
    const subject = `OneLink ${documentName} ${els.invNo.value || 'INV-001'}`;
    const message = `Dear ${client},\n\nYour OneLink ${documentName.toLowerCase()} is ready. The total amount is ₹${disp.grandTotal.textContent}.\n\nRegards,\nKriyon Group Pvt. Ltd.`;
    window.location.href = `mailto:${els.cEmail.value}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    setTimeout(downloadPDF, 800);
}

document.addEventListener('DOMContentLoaded', init);
