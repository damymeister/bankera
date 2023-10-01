import './css/service.css';

export default function Service({ service }) {
    const { name, icon, image, description } = service;

    return (
        <div className="service">
            <img 
                src={image} 
                alt={`${name}`}  
            />
            <h2>{icon} {name}</h2>
            <p>{description}</p>
        </div>
    );
}