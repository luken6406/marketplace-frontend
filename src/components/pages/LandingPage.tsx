import React, { useState, useEffect } from 'react';
import ListingCard, { CardProps } from '../ListingCard';
import { categories } from './Listings';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/AuthContext';
import { firstListingMessage } from '../layout/Navbar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Dados dos banners centrais (Marketplace, Compra Segura, Comunidade Unifor, etc)
const bannerSlides = [
  {
    id: 1,
    title: "O Marketplace Oficial dos Estudantes Unifor",
    subtitle: "Compre e venda livros, eletrônicos e acessórios de forma simples, rápida e sustentável.",
    badge: "100% Universitário",
    image: "https://unifor.br/documents/20143/703914/alunos-campus-banner-desktop-foto-ares-soares.jpg/94be9ce8-ac7a-9e71-ef7e-8bda5fd6361b?t=1755791605275",
    ctaText: "Criar Conta Gratuitamente",
    ctaLink: "register",
    passOn: ""
  },
  {
    id: 2,
    title: "Negociações Seguras Dentro do Campus",
    subtitle: "Combine entregas diretamente no centro de convivência, biblioteca ou praças da Unifor sem custo de frete.",
    badge: "Compra & Entrega Segura",
    image: "https://unifor.br/documents/20143/0/CREDITO_-_DA_FOTO_%28ARES_SOARES%29_-_1%20%281%29.jpg/8c247ead-33f7-ffc4-a4e9-736dc3c4f433?version=1.0&t=1782420122279",
    ctaText: "Anuncie Grátis Agora",
    ctaLink: "register",
    passOn: "Crie sua conta para anunciar"
  },
  {
    id: 3,
    title: "Economize em Livros e Materiais Didáticos",
    subtitle: "Passe pra frente apostilas e livros do semestre passado e garanta o material do novo período economizando.",
    badge: "Economia Circular",
    image: "https://unifor.br/documents/20143/418852/entrada+da+biblioteca+da+unifor_ares+soares_%28800%29.jpg/8bd5b1f1-74a7-8c41-1303-b69ad6d12ac9?t=1564768675717",
    ctaText: "Ver Livros Disponíveis",
    ctaLink: "listings",
    passOn: "Livros"
  },
  {
    id: 4,
    title: "Desapegue de Eletrônicos com Facilidade",
    subtitle: "Encontre notebooks, tablets, calculadoras científicas e fones com os melhores preços do campus.",
    badge: "Tecnologia & Gadgets",
    image: "https://tudorondonia.com/uploads/31-05-23-tbrdsqsus07piqi.jpg",
    ctaText: "Explorar Eletrônicos",
    ctaLink: "listings",
    passOn: "Eletrônicos"
  }
];

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goToRegisterScreen = (message: string) => {
    navigate('/register', {
      state: {
        message: message
      }
    });
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [listings, setListings] = useState<CardProps[]>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Captura o evento de instalação PWA
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário instalou o PWA');
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
      });
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/api/anuncios`)
      .then((res) => res.json())
      .then((data: CardProps[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setListings(data);
        }
      })
      .catch(() => {
        // Se a API não responder, mantém os dados fictícios para a landing page não ficar vazia
      });
  }, []);

  // Transição automática do Banner Hero a cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Banner Central Rotativo (Hero Section com 4 Destaques) */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto min-h-[480px] md:min-h-[520px] flex items-center relative">
          {bannerSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 flex flex-col md:flex-row items-center justify-between p-6 md:p-12 gap-8 ${
                index === currentSlide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Conteúdo Textual */}
              <div className="w-full md:w-1/2 space-y-5 text-left z-20">
                <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-semibold tracking-wide uppercase">
                  {slide.badge}
                </span>
                <h1 className="text-3xl md:text-5xl font-black leading-tight text-white drop-shadow-sm">
                  {slide.title}
                </h1>
                <p className="text-slate-300 text-base md:text-lg max-w-xl leading-relaxed">
                  {slide.subtitle}
                </p>
                
                <div className="pt-2 flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      navigate(`/${slide.ctaLink}`, {
                        state: {
                          message: slide.passOn
                        }
                      });
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 cursor-pointer"
                  >
                    {slide.ctaText}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                  {isInstallable && (
                    <button
                      onClick={handleInstallClick}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-5 py-3 rounded-xl transition-all cursor-pointer"
                    >
                      Baixar como PWA
                    </button>
                  )}
                </div>
              </div>

              {/* Imagem Ilustrativa do Banner */}
              <div className="w-full md:w-1/2 h-64 md:h-96 relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent md:hidden" />
              </div>
            </div>
          ))}
        </div>

        {/* Indicadores de Navegação dos Banners */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {bannerSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide ? 'w-8 bg-blue-500' : 'w-2.5 bg-slate-600 hover:bg-slate-400'
              }`}
              aria-label={`Ir para banner ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Banner Informativo de Benefícios */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Compra Segura no Campus</h3>
              <p className="text-xs text-slate-500">Encontros presenciais em pontos conhecidos da universidade.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Zero Taxas de Intermediação</h3>
              <p className="text-xs text-slate-500">100% gratuito para estudantes anunciarem e negociarem.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Experiência PWA Leve</h3>
              <p className="text-xs text-slate-500">Acesse instantaneamente sem precisar baixar apps pesados.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Anúncios Reutilizando o ListingCard por Categorias */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Anúncios Recentes no Campus</h2>
          <p className="text-slate-600 mt-2">Navegue pelas ofertas publicadas pelos seus colegas de faculdade.</p>
        </div>

        {categories.map((cat) => {
          const categoryListings = listings.filter((item) => item.category === cat);

          if (categoryListings.length === 0) return null;

          return (
            <div key={cat} id={cat.toLowerCase()} className="space-y-6">
              {/* Header da Categoria */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  <h3 className="text-2xl font-bold text-slate-800">{cat}</h3>
                </div>
                <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">
                  {categoryListings.length} {categoryListings.length === 1 ? 'item' : 'itens'}
                </span>
              </div>

              {/* Grid Reutilizando ListingCard */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryListings.map((listing) => (
                  <ListingCard key={listing.id} {...listing} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Banner de Call to Action (CTA Principal) */}
      {!user ? (
        <section id="anunciar" className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16 px-4">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <span className="bg-blue-400/20 text-blue-200 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Faça Parte da Comunidade
            </span>
            <h2 className="text-3xl md:text-5xl font-black leading-tight">
              Tem algo parado no armário que pode ser útil para outro aluno?
            </h2>
            <p className="text-blue-100 text-base md:text-xl max-w-2xl mx-auto">
              Crie seu anúncio em menos de 2 minutos. É totalmente grátis e você combina a entrega diretamente no campus.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => {
                  goToRegisterScreen(firstListingMessage);
                }}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg px-8 py-4 rounded-xl shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                Crie Seu Primeiro Anúncio Grátis!
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section id="anunciar" className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16 px-4">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <span className="bg-blue-400/20 text-blue-200 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Desapegue Agora
            </span>
            <h2 className="text-3xl md:text-5xl font-black leading-tight">
              Pronto para liberar espaço no armário?
            </h2>
            <p className="text-blue-100 text-base md:text-xl max-w-2xl mx-auto">
              Publique seu item em menos de 2 minutos e combine a entrega diretamente com outros alunos no campus.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/list')}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg px-8 py-4 rounded-xl shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                + Anunciar Novo Item
              </button>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default LandingPage;