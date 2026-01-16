const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* 🍰 GET ALL CAKES */
export const getCakes = async () => {
  const res = await fetch(`${API_URL}/api/cakes`);
  if (!res.ok) throw new Error("Failed to fetch cakes");
  return res.json();
};

/* ⭐ GET FEATURED CAKES */
export const getFeaturedCakes = async () => {
  const res = await fetch(`${API_URL}/api/cakes/featured`);
  if (!res.ok) throw new Error("Failed to fetch featured cakes");
  return res.json();
};

/* 🎂 GET SINGLE CAKE */
export const getCakeById = async (id: string) => {
  const res = await fetch(`${API_URL}/api/cakes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch cake");
  return res.json();
};

/* 📦 PLACE ORDER */
export const placeOrder = async (orderData: any) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to place order");
  }

  return res.json();
};

/* 📋 GET USER ORDERS */
export const getUserOrders = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${API_URL}/api/orders/my-orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch orders");
  }

  return res.json();
};

/* 📋 GET ALL ORDERS (Admin) */
export const getAllOrders = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${API_URL}/api/orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch orders");
  }

  return res.json();
};

/* 🔄 UPDATE ORDER STATUS (Admin) */
export const updateOrderStatus = async (orderId: string, status: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update order status");
  }

  return res.json();
};

/* 📊 GET DAILY REPORT (Admin) */
export const getDailyReport = async (date: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${API_URL}/api/orders/daily-report?date=${date}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch daily report");
  }

  return res.json();
};

/* 📊 GET MONTHLY REPORT (Admin) */
export const getMonthlyReport = async (month: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${API_URL}/api/orders/monthly-report?month=${month}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch monthly report");
  }

  return res.json();
};

/* 📄 DOWNLOAD REPORT PDF (Admin) */
export const downloadReportPDF = async (type: string, date: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${API_URL}/api/orders/download-report?type=${type}&date=${date}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to download report");
  }

  // Trigger download
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${type}-report-${date}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

/* 🎂 GET ALL CUSTOM ORDERS (Admin) */
export const getCustomOrders = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${API_URL}/api/custom-orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch custom orders");
  }

  return res.json();
};

/* 🔄 UPDATE CUSTOM ORDER STATUS (Admin) */
export const updateCustomOrderStatus = async (orderId: string, status: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${API_URL}/api/custom-orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update custom order status");
  }

  return res.json();
};

/* 💬 GET ALL TESTIMONIALS */
export const getTestimonials = async () => {
  const res = await fetch(`${API_URL}/api/testimonials`);
  if (!res.ok) throw new Error("Failed to fetch testimonials");
  return res.json();
};

/* 💬 CREATE TESTIMONIAL */
export const createTestimonial = async (testimonialData: { name: string; content: string; rating: number }) => {
  const res = await fetch(`${API_URL}/api/testimonials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(testimonialData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create testimonial");
  }

  return res.json();
};

/* 🗑️ DELETE TESTIMONIAL (Admin) */
export const deleteTestimonial = async (testimonialId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${API_URL}/api/testimonials/${testimonialId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete testimonial");
  }

  return res.json();
};



/* 🖼️ GET GALLERY IMAGES */
export const getGalleryImages = async () => {
  const res = await fetch(`${API_URL}/api/gallery`);
  if (!res.ok) throw new Error("Failed to fetch gallery images");
  return res.json();
};

/* 📤 UPLOAD GALLERY IMAGE (Admin) */
export const uploadGalleryImage = async (formData: FormData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${API_URL}/api/gallery`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to upload gallery image");
  }

  return res.json();
};

/* 🗑️ DELETE GALLERY IMAGE (Admin) */
export const deleteGalleryImage = async (imageId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${API_URL}/api/gallery/${imageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete gallery image");
  }

  return res.json();
};

/* 📞 GET ALL CONTACTS (Admin) */
export const getContacts = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${API_URL}/api/contacts`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch contacts");
  }

  return res.json();
};

/* 📞 MARK CONTACT AS READ (Admin) */
export const markContactAsRead = async (contactId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${API_URL}/api/contacts/${contactId}/read`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to mark contact as read");
  }

  return res.json();
};

