/** Confirme os demais dados comerciais antes da publicação. */
export const shopConfig = {
  name: "Pastel da Praça",
  isDemo: true,
  whatsappNumber: "5519987715865", // Número informado pelo proprietário, com código do país e DDD.
  address: "",
  hours: "",
  instagramUrl: "",
  fulfillmentModes: ["pickup", "delivery"] as const, // Modos demonstrativos; confirme antes de publicar.
};
