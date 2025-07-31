export default function Index() {
  return (
    <div className="space-y-6 p-6">
      {/* Header Simple */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          🦄 Portfolio Overview
        </h1>
        <p className="text-gray-400">Monitor your Uniswap V3 positions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400 mb-1">Total Value</h3>
          <p className="text-xl font-bold text-green-400">$14,092.41</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400 mb-1">Unclaimed Fees</h3>
          <p className="text-xl font-bold text-blue-400">$216.82</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400 mb-1">Average APR</h3>
          <p className="text-xl font-bold text-purple-400">20.25%</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm text-gray-400 mb-1">Positions</h3>
          <p className="text-xl font-bold text-white">2 Active</p>
        </div>
      </div>

      {/* Simple Position Card */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Active Positions</h2>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white">ETH/USDC</h3>
            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm">
              Out of Range
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Current Price</p>
              <p className="text-white font-mono">$2,387.45</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Unclaimed Fees</p>
              <p className="text-green-400 font-mono">$127.50</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
