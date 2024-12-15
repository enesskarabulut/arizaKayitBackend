const arizalar = []; // Geçici bellek tablosu

exports.getArizalar = async () => arizalar;

exports.getAriza = async (id) => arizalar.find((ariza) => ariza.id === id);

exports.createNewAriza = async (data) => {
  const yeniAriza = { id: Date.now(), ...data };
  arizalar.push(yeniAriza);
  return yeniAriza;
};

exports.updateAriza = async (id, data) => {
  const index = arizalar.findIndex((ariza) => ariza.id === id);
  if (index === -1) return null;
  arizalar[index] = { ...arizalar[index], ...data };
  return arizalar[index];
};

exports.deleteAriza = async (id) => {
  const index = arizalar.findIndex((ariza) => ariza.id === id);
  if (index === -1) return null;
  return arizalar.splice(index, 1);
};
