<?php

namespace App\Http\Controllers;

use App\Models\Ledger;
use App\Models\Talangan;
use Carbon\Carbon;
use Inertia\Inertia;

class HistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Ledger::with('user'); 
        $talanganQuery = Talangan::with('user');
    
        if (request('month')) {
            $month = request('month');
            
            $startOfMonth = Carbon::createFromFormat('F', $month)->startOfMonth();
            $endOfMonth = Carbon::createFromFormat('F', $month)->endOfMonth();
            
            $query->whereBetween('created_at', [$startOfMonth, $endOfMonth]);
            $talanganQuery->whereBetween('created_at', [$startOfMonth, $endOfMonth]);
        } else {
            $currentMonthStart = Carbon::now()->startOfMonth();
            $currentMonthEnd = Carbon::now()->endOfMonth();
    
            $query->whereBetween('created_at', [$currentMonthStart, $currentMonthEnd]);
            $talanganQuery->whereBetween('created_at', [$currentMonthStart, $currentMonthEnd]);
        }
    
        return Inertia::render('History/Index', [
            "queryParams" => request()->query()?:null, 
            'transactions' => $query->orderBy('created_at', 'desc')->get(),
            'talangans' => $talanganQuery->orderBy('created_at', 'desc')->get(),
        ]);
    }

}
