import React from 'react'
import Tour from '../../components/tour/Tour'
import { useLocation } from 'react-router-dom'

function TourPage() {
  
  const location =  useLocation();
  const searchFields = location.state?.searchFields;


  return (
    <div><Tour searchFields={searchFields}/></div>
  )
}

export default TourPage