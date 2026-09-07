import React, { useState, useEffect } from 'react';
import { BookOpen, Upload, FileText, Presentation, File, LayoutList, ClipboardList, CheckCircle, Clock, X } from 'lucide-react';
import { mockMaterials } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { getMaterials, addMaterial as fbAddMaterial } from '../firebase/firestore';
import { uploadFile } from '../firebase/storage';

const getFileIcon = (type) => {
  switch (type) {
    case 'Lecture Slides': return <Presentation className="w-5 h-5 text-[#6347F5]" />;
    case 'Notes': return <FileText className="w-5 h-5 text-[#18A86B]" />;
    case 'Syllabus': return <LayoutList className="w-5 h-5 text-[#7458F7]" />;
    case 'Assignment': return <ClipboardList className="w-5 h-5 text-[#FF8A34]" />;
    case 'Past Paper': return <FileText className="w-5 h-5 text-[#E03A3A]" />;
    default: return <File className="w-5 h-5 text-[#6F7182]" />;
  }
};

const TABS = ['All', 'Lecture Slides', 'Notes', 'Syllabus', 'Assignment', 'Past Paper'];

export default function MaterialsPage() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState(mockMaterials);
  const [activeTab, setActiveTab] = useState('All');
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const stored = await getMaterials(user?.uid);
        if (stored && stored.length > 0) {
          setMaterials(stored);
        }
      } catch (err) {
        console.error("Failed to load materials:", err);
      }
    }
    load();
  }, [user]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadRes = await uploadFile(user?.uid, file, 'materials');
      const ext = file.name.split('.').pop().toLowerCase();
      let type = 'Notes';
      if (['ppt', 'pptx'].includes(ext)) type = 'Lecture Slides';
      if (file.name.toLowerCase().includes('syllabus')) type = 'Syllabus';
      if (file.name.toLowerCase().includes('assign')) type = 'Assignment';
      if (file.name.toLowerCase().includes('paper') || file.name.toLowerCase().includes('exam')) type = 'Past Paper';

      const newRecord = await fbAddMaterial(user?.uid, {
        name: file.name,
        type,
        course: 'DLD',
        size: uploadRes.size,
        url: uploadRes.url,
      });

      setMaterials(prev => [newRecord, ...prev]);
      setShowUpload(false);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const filteredMaterials = activeTab === 'All' 
    ? materials 
    : materials.filter(m => m.type === activeTab);

  const getCount = (tab) => {
    if (tab === 'All') return materials.length;
    return materials.filter(m => m.type === tab).length;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#7458F7] to-[#5F45E7] flex items-center justify-center text-white shadow-sm">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <h1 className="text-[24px] font-[650] text-[#202033] tracking-[-0.035em] leading-[1.15]">Study Materials</h1>
        </div>
        <button 
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center justify-center gap-2 bg-[#6347F5] text-white px-4 py-2 rounded-[8px] text-[12.5px] font-[700] hover:bg-[#5236E5] transition-colors cursor-pointer shadow-sm"
        >
          {showUpload ? <X className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
          {showUpload ? 'Cancel Upload' : 'Upload Material'}
        </button>
      </div>

      {showUpload && (
        <div className="p-8 border-2 border-dashed border-[#6347F5]/40 bg-[#F0ECFF]/40 rounded-[10px] flex flex-col items-center justify-center text-center transition-all">
          <Upload className="w-10 h-10 text-[#6347F5] mb-3" />
          <h3 className="text-[15px] font-[700] text-[#202033] mb-1">Drag and drop your files here</h3>
          <p className="text-[#6F7182] text-[12px] mb-4">Supported formats: PDF, DOCX, PPTX, TXT (Max 50MB)</p>
          <label className="bg-white text-[#6347F5] border border-[#6347F5] px-4 py-2 rounded-[8px] text-[12px] font-[700] cursor-pointer hover:bg-[#F0ECFF] transition-colors shadow-xs">
            Browse Files
            <input type="file" className="hidden" />
          </label>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-1 gap-2 hide-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 whitespace-nowrap px-3.5 py-1.5 rounded-[8px] text-[12px] font-[600] transition-colors cursor-pointer ${
              activeTab === tab 
                ? 'bg-[#6347F5] text-white shadow-xs' 
                : 'bg-white text-[#6F7182] border border-[#ECECF2] hover:bg-[#FCFCFE]'
            }`}
          >
            {tab}
            <span className={`px-2 py-0.5 rounded-[6px] text-[10px] font-[700] ${
              activeTab === tab ? 'bg-white/20 text-white' : 'bg-[#F0ECFF] text-[#6347F5]'
            }`}>
              {getCount(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* Material List */}
      <div className="card overflow-hidden">
        <ul className="divide-y divide-[#ECECF2]">
          {filteredMaterials.map((material) => (
            <li key={material.id} className="p-4 hover:bg-[#FCFCFE] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-[#F8F7FC] rounded-[8px] border border-[#ECECF2]/60 shrink-0">
                  {getFileIcon(material.type)}
                </div>
                <div>
                  <h4 className="text-[13.5px] font-[650] text-[#202033] mb-1">{material.name}</h4>
                  <div className="flex items-center gap-2.5 text-[11px] text-[#9295A5]">
                    <span className="font-[600] px-2 py-0.5 bg-[#F0ECFF] text-[#6347F5] rounded-[4px] text-[10px]">
                      {material.course}
                    </span>
                    <span>{material.size}</span>
                    <span>•</span>
                    <span>{new Date(material.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center sm:justify-end">
                {material.status === 'analyzed' ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-[600] text-[#159864] bg-[#EAF8F1] px-2.5 py-1 rounded-[6px]">
                    <CheckCircle className="w-3.5 h-3.5 text-[#18A86B]" />
                    Analyzed
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[10px] font-[600] text-[#FF8A34] bg-[#FFF3EB] px-2.5 py-1 rounded-[6px]">
                    <Clock className="w-3.5 h-3.5 animate-pulse text-[#FF8A34]" />
                    Processing
                  </span>
                )}
              </div>
            </li>
          ))}
          {filteredMaterials.length === 0 && (
            <div className="p-8 text-center text-[#9295A5] text-[13px]">
              No materials found for this category.
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}