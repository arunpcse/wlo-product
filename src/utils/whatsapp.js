const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919361046703';

/**
 * Build WhatsApp message and open wa.me link
 * @param {Array} items - cart items
 * @param {number} total - cart total
 * @param {Object} customer - { name, phone, address }
 */
export const sendWhatsAppOrder = (items, total, customer) => {
    const itemLines = items
        .map((item) => `${item.name} - ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`)
        .join('\n');

    const message = `Hello, I want to order:

${itemLines}

Total: ₹${total.toLocaleString('en-IN')}

Name: ${customer.name}
Phone: ${customer.phone}
Address: ${customer.address}`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
};

export const formatCurrency = (amount) =>
    `₹${Number(amount).toLocaleString('en-IN')}`;
