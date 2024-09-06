import React from 'react';
import { OwlCarousel, OwlCarouselOptions } from 'react-owl-carousel';

const TestimonialComponent = () => {
    return (
        <div className="container-xxl py-5">
            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-5 wow fadeIn" data-wow-delay="0.1s">
                        <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">Testimonial</div>
                        <h1 className="mb-4">What Say Our Clients!</h1>
                        <p className="mb-4">Tempor erat elitr rebum at clita. Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et eos labore. Clita erat ipsum et lorem et sit, sed stet no labore lorem sit. Sanctus clita duo justo et tempor eirmod magna dolore erat amet</p>
                        <a className="btn btn-primary rounded-pill px-4" href="">Read More</a>
                    </div>
                    <div className="col-lg-7 wow fadeIn" data-wow-delay="0.5s">
                        <OwlCarousel
                            className="owl-carousel testimonial-carousel border-start border-primary"
                            items={1}
                            loop={true}
                            nav={true}
                            dots={false}
                            autoplay={true}
                            autoplayTimeout={3000}
                        >
                            <div className="testimonial-item ps-5">
                                <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                                <p className="fs-4">Aliqu diam amet diam et eos labore. Clita erat ipsum et lorem et sit, sed stet no labore lorem sit. Sanctus clita duo justo et tempor eirmod magna dolore erat amet</p>
                                <div className="d-flex align-items-center">
                                    <img className="img-fluid flex-shrink-0 rounded-circle" src="img/testimonial-1.jpg" style={{ width: '60px', height: '60px' }} />
                                    <div className="ps-3">
                                        <h5 className="mb-1">Client Name</h5>
                                        <span>Profession</span>
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial-item ps-5">
                                <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                                <p className="fs-4">Aliqu diam amet diam et eos labore. Clita erat ipsum et lorem et sit, sed stet no labore lorem sit. Sanctus clita duo justo et tempor eirmod magna dolore erat amet</p>
                                <div className="d-flex align-items-center">
                                    <img className="img-fluid flex-shrink-0 rounded-circle" src="img/testimonial-2.jpg" style={{ width: '60px', height: '60px' }} />
                                    <div className="ps-3">
                                        <h5 className="mb-1">Client Name</h5>
                                        <span>Profession</span>
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial-item ps-5">
                                <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                                <p className="fs-4">Aliqu diam amet diam et eos labore. Clita erat ipsum et lorem et sit, sed stet no labore lorem sit. Sanctus clita duo justo et tempor eirmod magna dolore erat amet</p>
                                <div className="d-flex align-items-center">
                                    <img className="img-fluid flex-shrink-0 rounded-circle" src="img/testimonial-3.jpg" style={{ width: '60px', height: '60px' }} />
                                    <div className="ps-3">
                                        <h5 className="mb-1">Client Name</h5>
                                        <span>Profession</span>
                                    </div>
                                </div>
                            </div>
                        </OwlCarousel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialComponent;