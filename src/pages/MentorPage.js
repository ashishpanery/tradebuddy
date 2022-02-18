import axios from "axios";
import "./MentorPage.css";
import React, { useEffect, useState, useRef } from "react";
// import { AiFillCaretDown } from "react-icons/ai";
import Header from "../components/Header/Header";
// import MentorGetStartedCard from "../components/MentorGetStartedCards/MentorGetStartedCard";
import Footer from "../components/Footer/Footer";
// import 'react-input-range/lib/css/index.css'
import "../custom css/assets/css/B.css"
import "../custom css/assets/css/A.style.css.pagespeed.cf.uEJwYWeXIf.css"
import PageLoader from "../components/PageLoader/PageLoader";
import { useHistory } from "react-router-dom"
import { useForm } from "react-hook-form";
import Select from 'react-select'
import Rating from "@mui/material/Rating";
import Slider from "react-slick";
import Helmet from "react-helmet"
import $ from "jquery"
import { IoMdCall } from 'react-icons/io'
import right_arrow from "../images/right-arrow.png"
import useHandleError from "../components/Handlers/ErrorHandler/ErrorHandler";
import { PaginationLoader } from "../components/Spinner/Spinner";

function MentorPage() {
  const [mentorData, setMentorData] = useState([]);
  const [filteredMentorData, setFilteredMentorData] = useState([])

  const [loading, setLoading] = useState(true)
  const [loadingFilteredData, setLoadingFilteredData] = useState(false)
  const [page, setPage] = useState(1)
  const [industry, setIndustry] = useState([])
  const [company, setCompany] = useState([])
  const { handleSubmit } = useForm()
  const history = useHistory()
  const [valueRating, setValueRating] = useState([])
  const [valueExperience, setValueExperience] = useState([])
  const [valueIndustry, setValueIndustry] = useState([])
  const [valueCompany, setValueCompany] = useState([])
  const [filter, setFilter] = useState("new")
  const pageSize = 10
  const mentorCardsSliderRef = useRef()
  const { handleError } = useHandleError(window.location.pathname)
  // Error States
  const [mentorListError, setMentorListError] = useState('')
  const [industryListError, setIndustryListError] = useState('')
  const [companyListError, setCompanyListError] = useState('')
  const [paginatedMentorError, setPaginatedMentorError] = useState('')
  const [filteredMentorListBigError, setFilteredMentorListBigError] = useState('')
  const [filteredMentorListSmallError, setFilteredMentorListSmallError] = useState('')

  // SLIDER BUTTONS
  const gotoNext = (sliderRef) => {
    sliderRef.current.slickNext();
  }
  const gotoPrev = (sliderRef) => {
    sliderRef.current.slickPrev();
  }

  // apply active className to the nav item
  $(function () {
    $("#nav_experts_item").addClass("nav_item_active");
    reCalibrateSliderArrows();

  });

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true)
      await axios
        .post(
          `${process.env.REACT_APP_GET_MENTOR_LIST}`,
          {
            pageNo: page,
            pageSize: pageSize,
            sort: "experience",
            filter: {}
          },

        )
        .then((response) => {
          // console.log(response)
          setMentorData(response.data.model)

          // if (mentorData.length === 0) {
          // }
          setFilteredMentorData(response.data.model)
        })
        .catch((err) => {
          // alert(err.message);
          setMentorListError(handleError(err.response.status))
        });
      setLoading(false)
    }
    fetchDetails()

    axios.get(process.env.REACT_APP_GET_INDUSTRY)
      .then((response => {
        // console.log(response)
        setIndustry(response.data)
      }))
      .catch(err => {
        console.log(err)
        setIndustryListError(handleError(err.response.status))

      })

    axios.get(process.env.REACT_APP_GET_COMPANY)
      .then((response) => {
        // console.log(response)
        setCompany(response.data)
      }).catch(err => {
        // console.log(err)
        setCompanyListError(handleError(err.response.status))

      })

  }, []);

  // CLEAR APPLIED FILTERS
  const clear = () => {
    setValueRating([])
    setValueExperience([])
    setValueIndustry([])
    setValueCompany([])
    setPage(1)
  }

  // GET PAGINATED MENTOR DATA
  const loadMore = async () => {
    await axios.post(`${process.env.REACT_APP_GET_MENTOR_LIST}`,
      {
        pageNo: page + 1,
        pageSize: pageSize,
        sort: "experience",
        filter: {
          "COMPANY": valueCompany
        }
      }
    )
      .then((response) => {
        // console.log(response)
        //show previous list along with the new list
        setMentorData(prevState => prevState.concat(response.data.model))
      })
      .catch((err) => {
        setPaginatedMentorError(handleError(err.response.status))

      });
    setPage(prevState => prevState + 1)
  }


  //CONVERT FILTER DATA IN RESPECTIVE FORMAT TO SEND TO API
  const filterData = () => {
    const ratingData = valueRating.map(item => {
      return item.value
    })
    const experienceData = [valueExperience.value]
    const industryData = valueIndustry.map(item => {
      return item.value
    })
    const companyData = valueCompany.map(item => {
      let capitalized_item = item.value.toLowerCase()
      return capitalized_item.charAt(0).toUpperCase() + capitalized_item.slice(1)
    })

    // console.log({ ratingData, experienceData, industryData, companyData })
    //MENTOR FILTERS
    setPage(1)
    setLoading(true)
    axios.post(`${process.env.REACT_APP_GET_MENTOR_LIST}`,
      {
        pageNo: 1,
        pageSize: pageSize,
        sort: "experience",
        filter: {
          RATING: ratingData,
          EXPERIENCE: experienceData,
          INDUSTRIES: industryData,
          COMPANIES: companyData,
        }
      }
    )
      .then((response) => {
        // console.log({ response })
        setMentorData(response.data.model)
      })
      .catch((err) => {
        setFilteredMentorListBigError(handleError(err.response.status))

      });
    setLoading(false)
  }



  // SELECT VALUES FOR FILTERS
  const options_rating = [
    { value: '5', label: <Rating name="half-rating" defaultValue={5} readOnly precision={0.5} size="small" /> },
    { value: '4', label: <Rating name="half-rating" defaultValue={4} readOnly precision={0.5} size="small" /> },
    { value: '3', label: <Rating name="half-rating" defaultValue={3} readOnly precision={0.5} size="small" /> },
    { value: '2', label: <Rating name="half-rating" defaultValue={2} readOnly precision={0.5} size="small" /> },
    { value: '1', label: <Rating name="half-rating" defaultValue={1} readOnly precision={0.5} size="small" /> }
  ]
  const options_experience = [
    { value: '1', label: 'upto 1 Year' },
    { value: '2', label: 'upto 2 Years' },
    { value: '3', label: 'upto 3 Years' },
    { value: '4', label: 'upto 4 Years' },
    { value: '5', label: 'upto 5 Years' },
    { value: '10', label: 'upto 10 Years' },
    { value: '15', label: 'upto 15 Years' },
    { value: '20', label: 'upto 20 Years' },
  ]
  const options_industry = industry.map(item => {
    return { value: item.name, label: item.name }
  })
  const options_company = company.map(item => {
    return { value: item.name, label: item.name }
  })


  // SLIDER SETTINGS
  const mentorListLength = mentorData.length
  const mentorSlider_settings = {
    infinite: false,
    autoPlay: false,
    rows: 1,
    slidesPerRow: mentorListLength.length < 4 ? mentorListLength.length : 4,
    variableWidth: false,
    speed: 500,
    dots: true,
    arrows: false,
    cssEase: "ease-out",
    slidesToScroll: 1,
    slidesToShow: 1,

    responsive: [
      {
        breakpoint: 1150,
        settings: {
          slidesPerRow: mentorListLength.length < 3 ? mentorListLength.length : 3,


        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesPerRow: mentorListLength.length < 2 ? mentorListLength.length : 2,


        }
      }
      , {
        breakpoint: 500,
        settings: {
          slidesPerRow: 1


        }
      }
    ]
  }

  // FILTER FUNCTION FOR NEW, MOST POPULAR AND BEGINNERS' FAVORITE
  const filterListByType = async (filterType) => {
    setFilter(filterType)
    setLoadingFilteredData(true)
    await axios.post(`${process.env.REACT_APP_GET_MENTOR_LIST_BY_TYPE}/${filterType}`,
      {
        "pageNo": 1,
        "pageSize": 5
      })
      .then(resp => {
        // console.log(resp.data.model)
        setFilteredMentorData(resp.data.model)
        setLoadingFilteredData(false)
      })
      .catch(err => {
        setFilteredMentorListSmallError(handleError(err.response.status))

        setLoadingFilteredData(false)
      })
  }

  //FILTER DATA BY NEW, MOST POPULAR AND BEGINNERS' FAVORITE
  const onSubmit = () => {
    // console.log({ valueRating, valueExperience, valueIndustry, valueCompany })
    filterData()

  }

  useEffect(() => {
    window.addEventListener('resize', () => reCalibrateSliderArrows())
    // return window.removeEventListener('resize', () => reCalibrateSliderArrows())
  }, [])

  const reCalibrateSliderArrows = () => {
    $('.mentorCardsSliderRow .slick-dots').length === 0 ? $('.mentorCardsSliderRow .slider_arrows').addClass('d-none') : $('.mentorCardsSliderRow .slider_arrows').removeClass('d-none')
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>List of Mentors | Set Up One On One Session - TradeBuddy  </title>
      </Helmet>
      {
        loading
          ?
          <PageLoader />
          :
          <>
            <Header />
            <div className="mentorPage pt-default">
              <section className="mentorList">
                <div className="job_listing_area section-bg2">
                  <div className="container">
                    <div className="row">
                      <div className="mentorText">
                        <h1>
                          Excellent mentors for your bright future as a{" "}
                          <span>Software Engineer</span>
                        </h1>
                        <p>With predicted wait time and verified details</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="mentors ">
                        <div className="mentorGetStarted ">
                          <h2>Mentors to get you started with</h2>
                        </div>
                        <div className="mentorGetStartedButtons d-flex">
                          <button onClick={() => filterListByType("new")} className={`btn ${filter === "new" ? "mentor-active" : "mentor-inactive"}`} id="newButton">New</button>
                          <button onClick={() => filterListByType("most_popular")} className={`btn my-3 my-md-0 ${filter === "most_popular" ? "mentor-active" : "mentor-inactive"}`}>Most Popular</button>
                          <button onClick={() => filterListByType("beginersfaviourite")} className={`btn ${filter === "beginersfaviourite" ? "mentor-active" : "mentor-inactive"}`}>Beginners Favorite</button>
                        </div>
                        <section className="mentorCardsSliderRow">
                          <div className="container my-5">
                            <div className="customSlick">
                              {
                                loadingFilteredData ?
                                  <PaginationLoader />
                                  :
                                  filteredMentorListSmallError ?
                                    filteredMentorListSmallError
                                    :
                                    <Slider {...mentorSlider_settings} ref={mentorCardsSliderRef}>
                                      {
                                        filteredMentorData.map((item, index) => {
                                          const { name, designation, currentCompany, photoUrl, experience, currentCity, currentCountry, currency, callRatePerMin, rating } = item
                                          return <div className="h-100 extraPadding cursor-pointer" key={index} style={{ width: "auto" }} >
                                            <div className='mx-2 p-3 d-flex flex-column  custom_box_shadow align-items-stretch justify-content-between h-100'
                                              style={{ width: "220px", background: "#E7FDFD" }}
                                              onClick={() => history.push(`/profile/${item.id}/${name.split(" ").join("-")}`)}
                                            >
                                              <div className="d-flex justify-content-center mt-5 position-relative" >
                                                <div style={{ position: "absolute", top: "-8.5em" }}>
                                                  <img className='card-img-top' src={photoUrl} style={{ width: "120px", aspectRatio: "1", borderRadius: "50%" }} alt="" />
                                                </div>
                                              </div>
                                              <div className="px-2 pb-2 pt-3 h-100 text-center">
                                                <h4 className="fs-5 fw-600 text-black my-0 flexible  " style={{ minHeight: "2em", }}>{name}</h4>
                                                <h6 style={{ minHeight: "3em", fontSize: "16px" }} className="text-black my-0 py-2 " >{designation} </h6>
                                                <p style={{ fontSize: "14px" }} className='mt-2 text-black' >{currentCompany}</p>
                                              </div>
                                              <div className="d-flex justify-content-center">
                                                <div className='text-start'>
                                                  <p className=''>Exp: {experience} years</p>
                                                  <p >{currentCity}, {currentCountry}</p>
                                                  <p style={{ color: "rgb(46, 175, 180)" }}>{currency} {callRatePerMin}/minute</p>
                                                </div>
                                              </div>
                                              <p className="mt-1 text-center">
                                                <Rating name="half-rating" defaultValue={rating} readOnly precision={0.5} size="small" />
                                              </p>
                                              <div className='position-relative ' >
                                                <div className='' style={{ borderRadius: "50%", background: "#2EAFB4", padding: ".25em", position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: "-2.5em" }}>
                                                  <IoMdCall style={{ width: "40px", height: "40px", color: "white" }} />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        })}
                                    </Slider>
                              }
                            </div>
                            {/* </div> */}
                            <div className='d-flex justify-content-center gap-5  mt-2 slider_arrows' >
                              <div onClick={() => gotoPrev(mentorCardsSliderRef)} className='position-relative' >
                                <img className='cursor-pointer me-5 slider_arrows_left_img' src={right_arrow} alt="prev_arrow" style={{ width: "20px", transform: "scale(-1,1)" }} />
                              </div>
                              <div onClick={() => gotoNext(mentorCardsSliderRef)} className='position-relative'>
                                <img className='cursor-pointer ms-5 slider_arrows_right_img' src={right_arrow} alt="next_arrow" style={{ width: "20px" }} />
                              </div>
                            </div>
                          </div>
                        </section>

                      </div>
                    </div>
                    <div className="row mt-5">
                      <div className="col-lg-4">
                        <div className="job_filter white-bg">
                          <div className="form_inner white-bg">
                            <h3>Filter</h3>
                            <form onSubmit={handleSubmit(onSubmit)}>
                              <div className="row">
                                <div className="col-lg-12">
                                  <div>
                                    <label htmlFor="select_box_rating">Ratings</label>
                                    <Select className="mb-3" id="select_box_rating" isMulti isSearchable={false} options={options_rating} value={valueRating} onChange={setValueRating} />
                                    <label htmlFor="select_box_experience">Experience</label>
                                    <Select className="mb-3" id="select_box_experience" isSearchable={false} options={options_experience} value={valueExperience} onChange={setValueExperience} />
                                    {
                                      industryListError ? industryListError :
                                        <>
                                          <label htmlFor="select_box_industry">Industry</label>
                                          <Select className="mb-3" id="select_box_industry" isMulti options={options_industry} value={valueIndustry} onChange={setValueIndustry} />
                                        </>
                                    }
                                    {
                                      companyListError ? companyListError :
                                        <>
                                          <label htmlFor="select_box_company">Company</label>
                                          <Select className="mb-3" id="select_box_company" isMulti options={options_company} value={valueCompany} onChange={setValueCompany} />
                                        </>
                                    }

                                  </div>
                                </div>
                              </div>
                              <div className="reset_btn">
                                <button className="boxed-btn3 w-100 mb-3" type="submit">Apply</button>
                                <button onClick={() => clear()} className="boxed-btn3 w-100" type="reset">Reset</button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                      {/* mentor list */}
                      <div className="col-lg-8">
                        <div className="recent_joblist_wrap">
                          <div className="recent_joblist  ">
                            <div className="row align-items-center">
                              <div className="col-md-6">
                                <h4>Mentor List</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="job_lists m-0">
                          <div className="row">
                            {paginatedMentorError ? paginatedMentorError :
                              filteredMentorListBigError ? filteredMentorListBigError :
                                mentorListError ? mentorListError :
                                  mentorData.map((mentor, index) => {
                                    const { currentCompanyObject } = mentor
                                    let newName = mentor.name.split(" ")
                                    return <div className="col-lg-12 col-md-12 d-flex justify-content-center align-items-center d-md-block text-center " key={index}>

                                      <div className="single_jobs justify-content-between w-100 bg-white text-center ">
                                        <div className="d-flex flex-column flex-md-row">
                                          <div className="jobs_left d-flex  align-items-center w-100 mx-auto">
                                            <div>
                                              <img className="mentorProfilePic" src={mentor.photoUrl} alt="" />
                                              <p className="mt-1">
                                                <Rating name="half-rating" defaultValue={mentor.rating} readOnly precision={0.5} size="small" />
                                              </p>
                                            </div>
                                            <div className="jobs_conetent w-100">
                                              <h4 onClick={() => history.push(`/profile/${mentor.id}/${newName.join("-")}`)} className="ms-md-2 text-md-start mentor_desc cursor-pointer">{mentor.name}</h4>
                                              <h4 onClick={() => history.push(`/profile/${mentor.id}/${newName.join("-")}`)} className="ms-md-2 text-md-start fs-5 mentor_desc cursor-pointer">{mentor.designation}</h4>
                                              {/* location, experience and rate */}
                                              <div className="links_locat d-flex align-items-center ms-md-3">
                                                <div className="location">
                                                  <p><img style={{ opacity: ".3" }} src="https://img.icons8.com/material-rounded/24/000000/marker.png" alt="location_icon" /> {mentor.currentCity}, {mentor.currentCountry}</p>
                                                </div>
                                                <div className="location my-1 my-md-0 ">
                                                  <p> <img style={{ opacity: ".7", filter: "grayscale(100%)" }} src="https://img.icons8.com/external-parzival-1997-flat-parzival-1997/30/000000/external-experience-human-networking-parzival-1997-flat-parzival-1997.png" alt="experience_icon" /> Exp: {mentor.experience} yrs </p>
                                                </div>
                                              </div>
                                              <div className="links_locat d-flex align-items-center mt-md-2 ms-md-3">
                                                <div className="location">
                                                  <p> <img style={{ opacity: ".3" }} src="https://img.icons8.com/ios-filled/18/000000/money-time.png" alt="cost_per_time_icon" /> {mentor.currency} {mentor.callRatePerMin} / minute</p>
                                                </div>
                                                <div className="location">
                                                </div>
                                              </div>

                                              <div className="row mt-3 fs-7 ms-1">
                                              </div>
                                            </div>
                                          </div>
                                          <div className="jobs_right">
                                            <div className="apply_now d-flex flex-column align-items-center">
                                              <img className={`mb-2 ${currentCompanyObject ? "mentorCompanyLogoPic" : "mentorCompanyDefaultLogo"}`} src={currentCompanyObject ? currentCompanyObject.logo : null} alt="" />
                                              <button onClick={() => history.push(`/profile/${mentor.id}/${newName.join("-")}`)} style={{ textDecoration: "none" }} className="btn btn_call_me">Call Me</button>
                                            </div>
                                            <div className="date">
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row mt-3 fs-7 ms-1">
                                          {
                                            mentor.services.length > 0 ?
                                              <div className="d-flex justify-content-start align-items-start gap-1 text-start flex-wrap">
                                                {
                                                  mentor.services.map((service, index) => {
                                                    return <p key={index} className=" fs-6 bg-secondary text-white p-1 rounded">{service}</p>
                                                  }
                                                  )
                                                }
                                              </div>
                                              :
                                              null
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  })
                            }
                          </div>
                          {
                            mentorData.length >= pageSize &&
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="pagination_wrap">
                                  <button className="btn" style={{ textDecoration: "none", color: "black" }} onClick={() => loadMore()}>Show More</button>
                                </div>
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <Footer />
          </>
      }
    </>
  );
}

export default MentorPage;
{/* <div className="menteesLookFor d-none">
                          <h1>Software Engineering Mentees also look for Mentors from</h1>
                          <div className="menteesLookForButtons">
                            <button>yagas development</button>
                            <button>html development</button>
                            <button>abs studies</button>
                            <button>php development</button>
                            <button>React JS</button>
                            <button>SAS</button>
                            <button>Python</button>
                            <button>Mongodb development</button>
                            <button>abs development</button>
                            <button>bootstrap development</button>
                            <button>angular development</button>
                          </div>
                        </div> */}