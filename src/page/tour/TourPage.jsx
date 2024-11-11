import React from 'react'
import Tour from '../../components/tour/Tour'
import { useLocation } from 'react-router-dom'

function TourPage() {
  
  const location =  useLocation();
  const filter4 = location.state?.filter4;


  return (
    <div><Tour searchTours={filter4}/></div>
  )
}

export default TourPage