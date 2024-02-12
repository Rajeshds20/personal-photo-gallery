import React, { useEffect, useState } from 'react';
import { useUser } from '../config/useUser';
import { useNavigate } from 'react-router-dom';
import ImageUploaderModal from '../components/ImageUploaderModal';
import '../assets/css/HomePage.css';

const ImageComponent = ({ image }) => {
    const imageSrc = `data:${image.contentType};base64,${image.data}`;

    return (
        <div>
            <img src={imageSrc} alt={image.name} />
            <p>{image.description}</p>
        </div>
    );
};
function HomePage() {

    const { loggedIn, user } = useUser();
    const [loading, setLoading] = useState(false);
    const [imagesLoading, setImagesLoading] = useState(false);
    const [myImages, setMyImages] = useState([]);
    const [ImageUploaderModalOpen, setImageUploaderModalOpen] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Personal Image Gallery";
        setLoading(true);
        if (!loggedIn) {
            setLoading(false);
            navigate('/login');
        }
        setLoading(false);
        const getImages = async () => {
            setImagesLoading(true);
            try {
                const response = await fetch(`${API_URL}/image/`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                console.log(data);
                if (response.status === 200) {
                    console.log("Images fetched");
                    setMyImages(data?.images);
                }
                else {
                    console.log("Images not fetched");
                }
            }
            catch (e) {
                console.log(e);
            }
            setImagesLoading(false);
        }

        getImages();
    }, []);

    return (
        <div>
            {
                loggedIn ?
                    loading ? <div>Loading...</div> :
                        <div>
                            <h1>Welcome to your personal image gallery</h1>
                            <h2>Hello {user?.name}</h2>

                            <div>
                                <ul className="image-list">
                                    {
                                        imagesLoading ? <div>Loading...</div> :
                                            myImages.length > 0 ?
                                                myImages.map((image) => (
                                                    <li onClick={() => {
                                                        fetch(`${API_URL}/image/${image._id}`, {
                                                            method: 'GET',
                                                            credentials: 'include',
                                                        })
                                                            .then(async (response) => {
                                                                const data = await response.blob();
                                                                if (response.status === 200) {
                                                                    const url = window.URL.createObjectURL(data);
                                                                    window.open(url, '_blank');
                                                                }
                                                                else {
                                                                    console.log("Image not found");
                                                                }
                                                            })
                                                            .catch((e) => {
                                                                console.log(e);
                                                            });
                                                    }} key={image?._id}>
                                                        <h4>{image?.name}</h4>
                                                        <h5>{image?.size}</h5>
                                                        <button onClick={() => {
                                                            fetch(`${API_URL}/image/${image?._id}`, {
                                                                method: 'DELETE',
                                                                credentials: 'include',
                                                            })
                                                                .then(async (response) => {
                                                                    const data = await response.json();
                                                                    if (response.status === 200) {
                                                                        console.log("Image deleted");
                                                                        setMyImages(myImages.filter((img) => img._id !== image._id));
                                                                    }
                                                                    else {
                                                                        console.log("Image not deleted");
                                                                    }
                                                                })
                                                                .catch((e) => {
                                                                    console.log(e);
                                                                });
                                                        }
                                                        }>Delete</button>
                                                    </li>
                                                )) : <div>No images found</div>
                                    }
                                </ul>

                                <button onClick={() => {
                                    if (myImages.length > 9) {
                                        alert("You can only upload 10 images");
                                        return;
                                    }
                                    setImageUploaderModalOpen(true);
                                }}>Upload Image</button>
                                {
                                    ImageUploaderModalOpen && <ImageUploaderModal
                                        open={ImageUploaderModalOpen}
                                        setOpen={setImageUploaderModalOpen}
                                        setMyImages={setMyImages}
                                        myImages={myImages}
                                    />
                                }
                            </div>
                        </div>
                    :
                    <div>
                        Loading...
                    </div>
            }
        </div >
    )
}

export default HomePage
