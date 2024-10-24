<?php

namespace App\Providers;

use Carbon\Carbon;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use App\Models\DefaultKas;
use App\Models\Ledger;
use App\Models\Talangan;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }   
        $this->shareInertiaData();
    }

    /**
     * Share data with Inertia.
     */
    private function shareInertiaData(): void
    {
        if ($this->app->runningInConsole()) {
            return;
        }

        if (!Schema::hasTable('ledgers')) {
            return;
        }

        Inertia::share([
            'defaultKas' => fn () => $this->getDefaultKas(),
            'ledgers' => fn () => $this->getLedgers(),
            'talangans' => fn () => $this->getTalangans(),
            'currentSaldo' => fn () => $this->getCurrentSaldo(),
        ]);
    }

    private function getDefaultKas()
    {
        return DefaultKas::first();
    }

    private function getLedgers()
    {
        $currentMonthStart = Carbon::now()->startOfMonth();
        $currentMonthEnd = Carbon::now()->endOfMonth();

        return Ledger::with('user')
            ->whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    private function getTalangans()
    {
        return Talangan::with('user')->orderBy('created_at', 'desc')->get();
    }

    private function getCurrentSaldo()
    {
        $currentDate = Carbon::now();
        $firstTransactionDate = Ledger::orderBy('created_at', 'asc')->first()->created_at;
        $months = $firstTransactionDate->diffInMonths($currentDate) + 1;
    
        $accumulatedSaldo = 0;
    
        for ($i = 0; $i < $months; $i++) {
            $startDate = $firstTransactionDate->copy()->addMonths($i)->startOfMonth();
            $endDate = $startDate->copy()->endOfMonth();
    
            $totalInThisMonth = Ledger::where('status', 'IN')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('amount');
    
            $totalOutThisMonth = Ledger::where('status', 'OUT')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('amount');
    
            $monthlyBalance = $totalInThisMonth - $totalOutThisMonth;
            $accumulatedSaldo += $monthlyBalance;
        }
    
        return $accumulatedSaldo;
    }
}