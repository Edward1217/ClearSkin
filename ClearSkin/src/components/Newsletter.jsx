import React from 'react';

const NewsletterComponent = () => {
    return (
        <div className="container-fluid bg-primary newsletter py-5">
            <div className="container">
                <div className="row g-5 align-items-center">
                    <div className="col-md-5 ps-lg-0 pt-5 pt-md-0 text-start wow fadeIn" data-wow-delay="0.3s">
                        <img className="img-fluid" src="img/newsletter.png" alt="" />
                    </div>
                    <div className="col-md-7 py-5 newsletter-text wow fadeIn" data-wow-delay="0.5s">
                        <div className="btn btn-sm border rounded-pill text-white px-3 mb-3">Newsletter</div>
                        <h1 className="text-white mb-4">Let's subscribe the newsletter</h1>
                        <div className="position-relative w-100 mt-3 mb-2">
                            <input className="form-control border-0 rounded-pill w-100 ps-4 pe-5" type="text" placeholder="Enter Your Email" style={{ height: '48px' }} />
                            <button type="button" className="btn shadow-none position-absolute top-0 end-0 mt-1 me-2"><i className="fa fa-paper-plane text-primary fs-4"></i></button>
                        </div>
                        <small className="text-white-50">Diam sed sed dolor stet amet eirmod</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsletterComponent;