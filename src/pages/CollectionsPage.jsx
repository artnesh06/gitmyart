import React, { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { LoadingSpinner } from '../components/LoadingSpinner'

export default function CollectionsPage() {
  const { api } = useApi()
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCollections()
  }, [])

  const loadCollections = async () => {
    setLoading(true)
    const data = await api('/collections')
    if (data) setCollections(data.collections || [])
    setLoading(false)
  }

  return (
    <div>
      <h2 className="section-title" style={{ marginBottom: '20px' }}>
        All Collections
      </h2>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="collection-grid" id="allCollGrid">
          {collections.map((collection) => (
            <div key={collection.id} className="coll-card">
              <div className="coll-card-img">
                <img src={collection.image} alt={collection.name} />
              </div>
              <div className="coll-card-body">
                <h3>{collection.name}</h3>
                <p>{collection.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
