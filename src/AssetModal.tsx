// AssetModal.tsx
import React, { useState } from 'react';

interface AssetModalProps {
  asset: string;
  onClose: () => void;
}

const AssetModal: React.FC<AssetModalProps> = ({ asset, onClose }) => {
  const [activeTab, setActiveTab] = useState('deposit');

  return (
    <div className="modal-overlay">
      <div className="modal-content relative flex flex-col gap-4 overflow-y-auto p-4 pt-4">
        <div dir="ltr" data-orientation="horizontal">
          <div className="flex flex-row items-center justify-between gap-2 -mr-2 mb-4">
            <div role="tablist" aria-orientation="horizontal" className="items-center justify-center text-muted-foreground flex h-fit w-full flex-row rounded-[5px] bg-card p-[1px]" tabIndex={0} data-orientation="horizontal" style={{outline: 'none'}}>
              <button type="button" role="tab" aria-selected={activeTab === 'deposit'} data-state={activeTab === 'deposit' ? 'active' : 'inactive'} onClick={() => setActiveTab('deposit')} className="justify-center whitespace-nowrap rounded-sm py-1.5 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm flex h-10 flex-1 flex-row items-center gap-2 px-0 font-normal uppercase text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" tabIndex={-1} data-orientation="horizontal">
                Deposit
              </button>
              <button type="button" role="tab" aria-selected={activeTab === 'borrow'} data-state={activeTab === 'borrow' ? 'active' : 'inactive'} onClick={() => setActiveTab('borrow')} className="justify-center whitespace-nowrap rounded-sm py-1.5 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm flex h-10 flex-1 flex-row items-center gap-2 px-0 font-normal uppercase text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" tabIndex={-1} data-orientation="horizontal">
                Borrow
              </button>
              <button type="button" role="tab" aria-selected={activeTab === 'withdraw'} data-state={activeTab === 'withdraw' ? 'active' : 'inactive'} onClick={() => setActiveTab('withdraw')} className="justify-center whitespace-nowrap rounded-sm py-1.5 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm flex h-10 flex-1 flex-row items-center gap-2 px-0 font-normal uppercase text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" tabIndex={-1} data-orientation="horizontal">
                Withdraw
              </button>
              <button type="button" role="tab" aria-selected={activeTab === 'repay'} data-state={activeTab === 'repay' ? 'active' : 'inactive'} onClick={() => setActiveTab('repay')} className="justify-center whitespace-nowrap rounded-sm py-1.5 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm flex h-10 flex-1 flex-row items-center gap-2 px-0 font-normal uppercase text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" tabIndex={-1} data-orientation="horizontal">
                Repay
              </button>
            </div>
            <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/10 hover:text-foreground h-8 w-8 rounded-sm gap-1 shrink-0 text-muted-foreground" type="button" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x shrink-0 transition-colors h-5 w-5">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="flex flex-col gap-4 md:!h-auto md:flex-row md:items-stretch" style={{height: 'calc(-108px + 100dvh)'}}>
            <div className="flex h-full w-full max-w-[28rem] flex-col gap-4 md:h-auto md:w-[28rem]">
              <div className="relative flex w-full flex-col">
                <div className="relative z-[2] w-full">
                  <div className="relative w-full">
                    <div className="absolute left-3 top-1/2 z-[2] -translate-y-2/4">
                      <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:border-secondary hover:text-primary-foreground border hover:bg-secondary/5 h-8 rounded-sm px-3 py-2 gap-1" style={{width: '60px', height: '40px'}}>
                        <p className="font-mono font-normal text-sm text-inherit transition-colors uppercase">Max</p>
                      </button>
                    </div>
                    <input type="number" className="flex h-10 w-full rounded-md border text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none relative z-[1] border-primary bg-card px-0 py-0 text-right text-2xl" autoComplete="off" step="any" value="" style={{height: '70px', padding: '14px 124.8px 30px 84px'}} />
                    <div className="absolute right-3 top-0 z-[2] flex flex-col items-end justify-center" style={{height: '70px'}}>
                      <p className="text-foreground font-mono font-normal text-right text-2xl">{asset}</p>
                    
                    </div>
                  </div>
                </div>
                <div className="relative z-[1] -mt-2 flex w-full flex-row flex-wrap justify-between gap-x-2 gap-y-1 rounded-b-md bg-primary/25 px-3 pb-2 pt-4">
                  <div className="flex flex-row items-center gap-1.5 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet h-3 w-3 text-foreground">
                      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                    </svg>
                    <p className="text-foreground font-mono font-normal text-xs">0.00 {asset}</p>
                  </div>
                  <div className="flex flex-row items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download h-3 w-3 text-foreground">
                      <path d="M21 15v4a2 0 0 1-2 2H5a2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" x2="12" y1="15" y2="3"></line>
                    </svg>
                    <p className="text-foreground font-mono font-normal text-xs">0.00 {asset}</p>
                  </div>
                </div>
              </div>
              <div className="-m-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden p-4 md:pb-6">
                <div className="flex min-h-[116px] flex-col gap-3 popover-content">
                  <div className="flex w-full justify-between flex-row items-center gap-2">
                    <p className="text-muted-foreground font-sans text-xs font-normal w-max">Price</p>
                    <div className="flex flex-row gap-1">
                      <p className="text-foreground font-mono text-sm font-normal">$3.43</p>
                    </div>
                  </div>
                  <div className="flex w-full justify-between flex-row items-center gap-2">
                    <p className="text-muted-foreground font-sans text-xs font-normal w-max">Deposit APR</p>
                    <div>
                      <div className="relative flex flex-row items-center gap-1.5" data-state="closed">
                        <div className="flex shrink-0 flex-row token-logos">
                          <div className="relative shrink-0" style={{width: '16px', height: '16px'}}>
                            <img className="relative z-[1] rounded-[50%]" src="https://arweave.net/OlHnBnAbU5fQtgu9I4z_0OBninKjDwfIxiLzJVuxMYQ" alt="OSHI logo" style={{width: '16px', height: '16px'}} />
                          </div>
                        </div>
                        <p className="font-mono text-sm font-normal text-primary-foreground decoration-primary-foreground/50 underline decoration-dotted decoration-1 underline-offset-2">4.67%*</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full justify-between flex-row items-center gap-2">
                    <p className="text-muted-foreground font-sans text-xs font-normal w-max">Your borrow limit</p>
                    <div className="flex flex-row gap-1">
                      <p className="text-foreground font-mono text-sm font-normal">&lt;$0.01</p>
                    </div>
                  </div>
                  <div className="flex w-full justify-between flex-row items-center gap-2">
                    <p className="text-muted-foreground font-sans text-xs font-normal w-max my-0.5 shrink-0">Your utilization</p>
                    <div className="flex flex-row items-center">
                      <div className="flex flex-row items-center gap-2">
                        <p className="text-foreground font-mono text-sm font-normal">0.00%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col gap-3">
                <div className="flex w-full flex-col gap-3">
                  <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-3 gap-1 h-auto min-h-14 w-full rounded-md py-2" disabled style={{overflowWrap: 'anywhere'}}>
                    <p className="font-mono font-normal text-sm text-inherit transition-colors text-wrap uppercase">Enter an amount</p>
                  </button>
                </div>
              </div>
              <div className="-mt-4 h-0 w-[28rem] max-w-full"></div>
            </div>
            {/* Similar content for other tabs, omitted for brevity */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetModal;