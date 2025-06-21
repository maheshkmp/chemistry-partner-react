export const purchasePaper = async (paperId) => {
  const response = await axios.post(`/api/papers/${paperId}/purchase`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};