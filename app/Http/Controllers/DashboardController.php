<?php

namespace App\Http\Controllers;

use App\Models\Galon;
use App\Models\Ledger;
use App\Models\Talangan;
use App\Models\User;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Ledger::with('user');

        $currentMonthStart = Carbon::now()->startOfMonth();
        $currentMonthEnd = Carbon::now()->endOfMonth();
    
        $galonDriver = Galon::get();

        $saldo = DB::table('ledgers')
                ->select(DB::raw('YEAR(created_at) as year, MONTH(created_at) as month'))
                ->selectRaw('SUM(CASE WHEN status = "IN" THEN amount ELSE 0 END) as total_in')
                ->selectRaw('SUM(CASE WHEN status = "OUT" THEN amount ELSE 0 END) as total_out')
                ->selectRaw('SUM(CASE WHEN status = "IN" THEN amount ELSE 0 END) - SUM(CASE WHEN status = "OUT" THEN amount ELSE 0 END) as saldo_sisa')
                ->groupBy(DB::raw('YEAR(created_at), MONTH(created_at)'))
                ->having('saldo_sisa', '>', 0)  
                ->get();

        $kas = $query->where('status', 'IN')
            ->whereLike('transaction_purpose', '%kas%')
            ->whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])
            ->sum('amount');

        $talangan = Talangan::query()->sum('amount');
        $talanganReverse = Talangan::where('dikembalikan', true)->sum('amount');

        $currentTalangan = $talangan - $talanganReverse;

        $peopleRemaining = User::whereDoesntHave('ledgers', function($query) use ($currentMonthStart, $currentMonthEnd) {
        $query->where('transaction_purpose', 'like', '%kas%')
                ->whereBetween('created_at', [$currentMonthStart, $currentMonthEnd]);
        })->count();

        $users = User::all();

        $talanganQuery = Talangan::with('user');
        $talanganDetail = $talanganQuery->where('dikembalikan', false)->get();

        return Inertia::render('Dashboard', [
            'saldoCounts' => $saldo,
            'galonDrivers' => $galonDriver,
            'users' => $users,
            'peopleRemaining' => $peopleRemaining,
            'kas' => $kas,  
            'talangan' => $currentTalangan,
            'talanganCounts' => $talanganDetail,
        ]);
    }
}
