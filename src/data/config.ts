/** Substitua somente após receber os dados oficiais da pastelaria. */
export const shopConfig = {
  name: "Ateliê do Pastel",
  isDemo: true,
  whatsappNumber: "", // Apenas dígitos, com código do país e DDD. Ex.: 55 + DDD + número.
  address: "",
  hours: "",
  instagramUrl: "",
  fulfillmentModes: ["pickup", "delivery"] as const, // Modos demonstrativos; confirme antes de publicar.
};
