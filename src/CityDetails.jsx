import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const PEXELS_API_KEY = "443Uro0KeescgFUE6urSaJ8YVjQJJlQARSJwPbDLNZTjbccRDzP4Hggd";

function CityDetails() {
  const { id } = useParams();
  const [city, setCity] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `https://api.pexels.com/v1/search?query=${id}&per_page=6`,
          { headers: { Authorization: PEXELS_API_KEY } }
        );
        setImages(response.data.photos.map(p => p.src.medium));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [id]);

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">{id}</h1>
      <div className="grid grid-cols-3 gap-4">
        {images.map((url, i) => (
          <img key={i} src={url} alt="" className="w-full h-48 object-cover rounded" />
        ))}
      </div>
    </div>
  );
}

export default CityDetails;