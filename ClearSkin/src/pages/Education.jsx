export default function Education() {

    return (
        <div className="container-fluid py-5">
            <div className="container">
                <div className="row g-5">
                    <div className="col-lg-12">
                        {/* Introduction Images in one row using Flexbox */}
                        <div className="d-flex justify-content-between mb-4">
                            <img src="/images/webMD.jpg" alt="WebMD" className="img-fluid" style={{ width: '30%' }}/>
                            <img src="/images/add.jpg" alt="AAD" className="img-fluid" style={{ width: '30%' }}/>
                            <img src="/images/skinHealth.jpg" alt="Skin Health" className="img-fluid" style={{ width: '30%' }}/>
                        </div>

                        {/* Title and Links */}
                        <h1 className="mb-4">Skin Health Resources</h1>
                        <ul className="list-group">
                            <li className="list-group-item">
                                <a href="https://www.webmd.com/skin-problems-and-treatments/default.htm" target="_blank" rel="noopener noreferrer" className="text-primary">WebMD – Skin Health</a>
                            </li>
                            <li className="list-group-item">
                                <a href="https://www.aad.org" target="_blank" rel="noopener noreferrer" className="text-primary">American Academy of Dermatology (AAD)</a>
                            </li>
                            <li className="list-group-item">
                                <a href="https://www.skinhealthinfo.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary">British Association of Dermatologists (BAD)</a>
                            </li>
                            <li className="list-group-item">
                                <a href="https://www.mayoclinic.org/diseases-conditions/dermatology" target="_blank" rel="noopener noreferrer" className="text-primary">Mayo Clinic – Dermatology</a>
                            </li>
                            <li className="list-group-item">
                                <a href="https://www.skincancer.org" target="_blank" rel="noopener noreferrer" className="text-primary">Skin Cancer Foundation</a>
                            </li>
                            <li className="list-group-item">
                                <a href="https://nationaleczema.org" target="_blank" rel="noopener noreferrer" className="text-primary">National Eczema Association</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
