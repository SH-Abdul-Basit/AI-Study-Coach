import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  BarChart2, 
  ChevronRight, 
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { mockPastPapers, mockPaperAnalysis, mockPaperDifficulty } from '../data/mockData';

export default function PastPapersPage() {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const handleAddPriority = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const renderPaperList = () => (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[24px] font-[650] text-[#202033] tracking-[-0.035em] leading-[1.15]">Past Paper Analysis</h1>
          <p className="text-[13px] text-[#6F7182] mt-1">Analyze previous exams to uncover recurring topics.</p>
        </div>
        <button 
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center px-4 py-2 bg-[#6347F5] hover:bg-[#5236E5] text-white rounded-[8px] text-[12.5px] font-[700] transition-colors cursor-pointer shadow-sm"
        >
          <Upload className="w-4 h-4 mr-2" /> Upload Past Paper
        </button>
      </div>

      {showUpload && (
        <div className="border-2 border-dashed border-[#6347F5]/40 bg-[#F0ECFF]/40 rounded-[10px] p-8 text-center">
          <Upload className="w-10 h-10 text-[#6347F5] mx-auto mb-3" />
          <h3 className="font-[700] text-[#202033] text-[15px] mb-1">Upload a PDF or Image</h3>
          <p className="text-[#6F7182] text-[12px] mb-4">Drag and drop your past paper here, or click to browse.</p>
          <button className="px-4 py-2 bg-white border border-[#ECECF2] text-[#202033] rounded-[8px] text-[12px] font-[700] shadow-xs cursor-pointer hover:bg-[#F0ECFF] transition-colors">
            Browse Files
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockPastPapers.map((paper) => (
          <div 
            key={paper.id} 
            onClick={() => setSelectedPaper(paper)}
            className="card p-5 cursor-pointer hover:border-[#6347F5]/40 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-[#F0ECFF] rounded-[8px] text-[#6347F5]">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="bg-[#EAF8F1] text-[#159864] text-[10px] font-[700] px-2.5 py-1 rounded-[6px] uppercase tracking-wider">
                  {paper.status}
                </span>
              </div>
              <h3 className="font-[700] text-[#202033] text-[15px] mb-1 group-hover:text-[#6347F5] transition-colors">{paper.title}</h3>
              <p className="text-[#6F7182] text-[12px] mb-4">{paper.course} • {paper.type}</p>

              <div className="flex items-center justify-between text-[11px] text-[#9295A5] mb-2 pt-3 border-t border-[#ECECF2]">
                <span>{paper.questions} Questions</span>
                <span className="font-[600] text-[#202033]">Year {paper.year}</span>
              </div>
            </div>

            <div className="flex items-center text-[#674BEF] font-[650] text-[11px] group-hover:translate-x-1 transition-transform mt-3">
              View Analysis <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      {/* Back button and header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSelectedPaper(null)}
            className="p-2 bg-white border border-[#ECECF2] rounded-[8px] text-[#6F7182] hover:text-[#202033] hover:bg-[#FCFCFE] transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-[24px] font-[650] text-[#202033] tracking-[-0.035em] leading-[1.15]">{selectedPaper.title}</h1>
            <p className="text-[12px] text-[#6F7182] mt-0.5">Prof: {selectedPaper.teacher} • {selectedPaper.year}</p>
          </div>
        </div>
        <button 
          onClick={handleAddPriority}
          className="flex items-center px-4 py-2 bg-[#6347F5] hover:bg-[#5236E5] text-white rounded-[8px] text-[12.5px] font-[700] transition-colors cursor-pointer shadow-sm"
        >
          <BarChart2 className="w-4 h-4 mr-2" /> Add Priority Topics to Study Plan
        </button>
      </div>

      {showToast && (
        <div className="bg-[#18A86B] text-white px-4 py-3 rounded-[8px] shadow-sm flex items-center text-[13px] font-[600] animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-4.5 h-4.5 mr-2.5" />
          Topics prioritized successfully based on analysis.
        </div>
      )}

      {/* AI Recommendations */}
      <div className="bg-[#F0ECFF] p-5 rounded-[10px] border border-[#6347F5]/20 flex items-start gap-3.5">
        <AlertCircle className="w-5 h-5 text-[#6347F5] shrink-0 mt-0.5" />
        <div>
          <h3 className="font-[700] text-[#202033] text-[13.5px] mb-1">AI Insights</h3>
          <p className="text-[#202033] text-[12px] leading-relaxed">
            Based on this {selectedPaper.year} paper, <span className="font-[700] text-[#6347F5]">K-Maps</span> and <span className="font-[700] text-[#6347F5]">Boolean Algebra</span> make up over 50% of the questions. The difficulty leans towards medium-to-hard, especially in the Sequential Logic section. Focus your study sessions on these high-frequency areas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Frequency Chart */}
        <div className="card p-6">
          <h2 className="text-[15px] font-[700] text-[#202033] tracking-[-0.015em] mb-4">Topic Frequency</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockPaperAnalysis} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ECECF2" />
                <XAxis type="number" hide />
                <YAxis dataKey="topic" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6F7182', fontSize: 11 }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #ECECF2', fontSize: '11px', boxShadow: '0 2px 8px rgba(30,30,60,.04)' }}
                />
                <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={20}>
                  {mockPaperAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div className="card p-6">
          <h2 className="text-[15px] font-[700] text-[#202033] tracking-[-0.015em] mb-4">Difficulty Distribution</h2>
          <div className="space-y-4">
            {mockPaperDifficulty.map((diff) => (
              <div key={diff.level}>
                <div className="flex justify-between text-[12px] font-[600] mb-1.5">
                  <span className="text-[#202033]">{diff.level}</span>
                  <span className="text-[#6F7182]">{diff.percentage}% ({diff.count} Qs)</span>
                </div>
                <div className="w-full bg-[#EEEEF4] h-[6px] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      diff.level === 'Easy' ? 'bg-[#18A86B]' : 
                      diff.level === 'Medium' ? 'bg-[#FF8A34]' : 'bg-[#EF4444]'
                    }`}
                    style={{ width: `${diff.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-[#FCFCFE] rounded-[8px] border border-[#ECECF2]">
             <h4 className="font-[650] text-[#202033] text-[12.5px] mb-1">Did you know?</h4>
             <p className="text-[#6F7182] text-[12px] leading-relaxed">
               Dr. Ahmed Khan's exams have consistently increased in "Hard" questions over the past two years, from 20% to 32%.
             </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {selectedPaper ? renderAnalysis() : renderPaperList()}
    </div>
  );
}