import React, { useRef } from "react";
import { IKContext, IKUpload } from "imagekitio-react";
import { toast } from "react-toastify";

const authenticator = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        return {
            signature: data.signature,
            expire: data.expire,
            token: data.token,
        };
    } catch (err) {
        throw new Error(`Authentication error: ${err.message}`);
    }
};

const Upload = ({ children, type = "image", setProgress, setData }) => {
    const fileInputRef = useRef();

    const onError = (err) => {
        console.error("Upload error:", err);
        toast.error("Upload failed!");
    };

    const onSuccess = (res) => {
        if (typeof setData === 'function') {
            setData(res); 
            console.log(res);
            
        }
    };

    const onUploadProgress = (progress) => {
        if (typeof setProgress === 'function') {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setProgress(percent);
        }
    };

    return (
        <IKContext
            publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
            urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
            authenticator={authenticator}
        >
            <IKUpload
                ref={fileInputRef}
                className="hidden"
                accept={`${type}/*`}
                useUniqueFileName={true}
                onError={onError}
                onSuccess={onSuccess}
                onUploadProgress={onUploadProgress}
            />
            <div className="cursor-pointer" onClick={() => fileInputRef.current.click()}>
                {children}
            </div>
        </IKContext>
    );
};

export default Upload;