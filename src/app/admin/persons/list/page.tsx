/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  Users,
  Search,
  Filter,
  RefreshCw,
  Grid3X3,
  List,
  Mail,
  Phone,
  Calendar,
  Shield,
  Church,
  User,
  IdCard,
  Heart,
  Shirt,
  Music,
  ChevronDown,
  UserCog,
} from "lucide-react";
import {
  choralVoiceTypeLabels,
  genderTypeLabels,
  maritalStatusTypeLabels,
  Role,
  roleTypeLabels,
} from "@/services/personService";
import { usePersons } from "@/hooks/usePersons";
import PageHeader from "@/components/admin/PageHeader";
import ModernCard from "@/components/admin/ModernCard";
import ModernCardLoading from "@/components/admin/ModernCardLoading";
import AddRolesModal from "@/components/roles/AddRolesModal";
import RemoveRolesModal from "@/components/roles/RemoveRolesModal";

export default function PersonListPage() {
  const {
    persons,
    loading,
    currentPage,
    totalPages,
    totalElements,
    refreshPersons,
    nextPage,
    prevPage,
  } = usePersons();

  const [filteredPersons, setFilteredPersons] = useState<typeof persons>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [genderFilter, setGenderFilter] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [churchFilter, setChurchFilter] = useState<string>("ALL");
  const [maritalStatusFilter, setMaritalStatusFilter] = useState<string>("ALL");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const [addRolesModalOpen, setAddRolesModalOpen] = useState(false);
  const [removeRolesModalOpen, setRemoveRolesModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [selectedUserRoles, setSelectedUserRoles] = useState<string[]>([]);

  // Initial load
  useEffect(() => {
    refreshPersons();
  }, []);

  // Search and filter effect
  useEffect(() => {
    let filtered = persons.filter(
      (person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.login.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.personalContactEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (genderFilter !== "ALL") {
      filtered = filtered.filter((person) => person.gender === genderFilter);
    }

    if (roleFilter !== "ALL") {
      filtered = filtered.filter((person) =>
        person.login.roles?.some((r) => r.role === roleFilter)
      );
    }

    if (churchFilter !== "ALL") {
      filtered = filtered.filter((person) => person.church === churchFilter);
    }

    if (maritalStatusFilter !== "ALL") {
      filtered = filtered.filter((person) => person.maritalStatus === maritalStatusFilter);
    }

    setFilteredPersons(filtered);
  }, [searchTerm, persons, genderFilter, roleFilter, churchFilter, maritalStatusFilter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshPersons();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const toggleCardExpanded = (personId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(personId)) {
      newExpanded.delete(personId);
    } else {
      newExpanded.add(personId);
    }
    setExpandedCards(newExpanded);
  };

  const openAddRolesModal = (userName: string, userId: string, roles: Role[]) => {
    setSelectedUserName(userName);
    setSelectedUserId(userId);
    setSelectedUserRoles(roles.map((r) => r.role));
    setAddRolesModalOpen(true);
  };

  const openRemoveRolesModal = (userName: string, userId: string, roles: Role[]) => {
    setSelectedUserName(userName);
    setSelectedUserId(userId);
    setSelectedUserRoles(roles.map((r) => r.role));
    setRemoveRolesModalOpen(true);
  };

  const clearValuesFromAddRolesModal = () => {
    setSelectedUserName(null);
    setSelectedUserId(null);
    setSelectedUserRoles([]);
    setAddRolesModalOpen(false);
  };

  const clearValuesFromRemoveRolesModal = () => {
    setSelectedUserName(null);
    setSelectedUserId(null);
    setSelectedUserRoles([]);
    setRemoveRolesModalOpen(false);
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString + "T00:00:00").toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Section */}
        <PageHeader
          icon={<Users className="h-8 w-8" />}
          title="Pessoas"
          description={loading ? "Carregando..." : `${totalElements} pessoas cadastradas`}
          actions={
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="bg-slate-800/50 hover:bg-slate-700/70 text-orange-400 border-slate-600 hover:border-orange-500/50 backdrop-blur-sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
          }
        />

        {/* Search and Filters */}
        <ModernCard className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 z-10" />
                <Input
                  placeholder="Buscar por nome, usuário ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 h-10 backdrop-blur-sm"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1 backdrop-blur-sm">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`${
                    viewMode === "grid"
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/70"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`${
                    viewMode === "list"
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/70"
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-slate-800/30 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50 backdrop-blur-sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="pt-4 border-t border-slate-600/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Gênero</label>
                    <select
                      value={genderFilter}
                      onChange={(e) => setGenderFilter(e.target.value)}
                      className="w-full h-10 rounded-md border border-slate-600 bg-slate-800/50 px-3 py-2 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 backdrop-blur-sm"
                    >
                      <option value="ALL">Todos</option>
                      <option value="MALE">Masculino</option>
                      <option value="FEMALE">Feminino</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Permissão</label>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="w-full h-10 rounded-md border border-slate-600 bg-slate-800/50 px-3 py-2 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 backdrop-blur-sm"
                    >
                      <option value="ALL">Todas</option>
                      <option value="ROLE_ADMIN">Admin</option>
                      <option value="ROLE_LEADER">Líder</option>
                      <option value="ROLE_USER">Usuário</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Igreja</label>
                    <select
                      value={churchFilter}
                      onChange={(e) => setChurchFilter(e.target.value)}
                      className="w-full h-10 rounded-md border border-slate-600 bg-slate-800/50 px-3 py-2 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 backdrop-blur-sm"
                    >
                      <option value="ALL">Todas</option>
                      {Array.from(new Set(persons.map(p => p.church).filter(Boolean))).sort().map((church) => (
                        <option key={church} value={church}>
                          {church}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Estado Civil</label>
                    <select
                      value={maritalStatusFilter}
                      onChange={(e) => setMaritalStatusFilter(e.target.value)}
                      className="w-full h-10 rounded-md border border-slate-600 bg-slate-800/50 px-3 py-2 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 backdrop-blur-sm"
                    >
                      <option value="ALL">Todos</option>
                      <option value="SINGLE">Solteiro(a)</option>
                      <option value="MARRIED">Casado(a)</option>
                      <option value="DIVORCED">Divorciado(a)</option>
                      <option value="NOT_INFORMED">Não Informado</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ModernCard>

        {/* Results Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            <ModernCardLoading count={viewMode === "grid" ? 12 : 8} />
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredPersons.map((person) => {
              const isExpanded = expandedCards.has(person.id);

              return (
                <ModernCard
                  key={person.id}
                  className="group flex flex-col h-full p-4 sm:p-6 text-white hover:border-orange-500/50 transition-all duration-300"
                >
                  {/* Avatar e Nome */}
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar
                      className="h-12 w-12 border-2 border-orange-500/50 flex-shrink-0"
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.login.username}`}
                      alt={person.name}
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-semibold text-orange-300 truncate">
                        {person.name}
                      </h2>
                      <p className="text-sm text-neutral-400 truncate">@{person.login.username}</p>
                    </div>
                  </div>

                  {/* Informações Básicas */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs">
                      <Mail className="h-3 w-3 text-orange-400 flex-shrink-0" />
                      <span className="text-slate-300 truncate">{person.personalContactEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Phone className="h-3 w-3 text-orange-400 flex-shrink-0" />
                      <span className="text-slate-300">{person.contact?.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Shield className="h-3 w-3 text-orange-400 flex-shrink-0" />
                      <div className="flex flex-wrap gap-1">
                        {person.login.roles?.map((role, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-orange-600/20 text-orange-400 rounded-full text-xs border border-orange-600/50 backdrop-blur-sm"
                          >
                            {roleTypeLabels[role.role] || role.role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Detalhes Expandidos */}
                  {isExpanded && (
                    <div className="space-y-2 pt-3 border-t border-slate-600/50 mb-4 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-orange-400" />
                          <div>
                            <p className="text-slate-400">Nascimento</p>
                            <p className="text-white">{formatDate(person.birthdate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-orange-400" />
                          <div>
                            <p className="text-slate-400">Gênero</p>
                            <p className="text-white">{genderTypeLabels[person.gender]}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-3 w-3 text-orange-400" />
                          <div>
                            <p className="text-slate-400">Estado Civil</p>
                            <p className="text-white">{maritalStatusTypeLabels[person.maritalStatus]}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Church className="h-3 w-3 text-orange-400" />
                          <div>
                            <p className="text-slate-400">Igreja</p>
                            <p className="text-white truncate">{person.church}</p>
                          </div>
                        </div>
                        {person.document && (
                          <div className="flex items-center gap-2 col-span-2">
                            <IdCard className="h-3 w-3 text-orange-400" />
                            <div>
                              <p className="text-slate-400">Documento</p>
                              <p className="text-white">{person.document.documentType}: {person.document.number}</p>
                            </div>
                          </div>
                        )}
                        {person.clothingSize && (
                          <div className="flex items-center gap-2">
                            <Shirt className="h-3 w-3 text-orange-400" />
                            <div>
                              <p className="text-slate-400">Tamanho</p>
                              <p className="text-white">{person.clothingSize}</p>
                            </div>
                          </div>
                        )}
                        {person.choralVoiceType && person.choralVoiceType !== "NOT_INFORMED" && (
                          <div className="flex items-center gap-2">
                            <Music className="h-3 w-3 text-orange-400" />
                            <div>
                              <p className="text-slate-400">Voz Coral</p>
                              <p className="text-white">{choralVoiceTypeLabels[person.choralVoiceType]}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Ações de Permissão */}
                      <div className="flex gap-2 pt-3 border-t border-slate-600/50">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs bg-slate-800/30 hover:bg-green-600/20 text-green-400 hover:text-green-300 border-green-600/50 hover:border-green-500 backdrop-blur-sm"
                          onClick={() => openAddRolesModal(person.login.username, person.login.id, person.login.roles || [])}
                        >
                          <UserCog className="h-3 w-3 mr-1" />
                          Adicionar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs bg-slate-800/30 hover:bg-red-600/20 text-red-400 hover:text-red-300 border-red-600/50 hover:border-red-500 backdrop-blur-sm"
                          onClick={() => openRemoveRolesModal(person.login.username, person.login.id, person.login.roles || [])}
                        >
                          <UserCog className="h-3 w-3 mr-1" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Botão Expandir/Recolher */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCardExpanded(person.id)}
                    className="w-full mt-auto bg-slate-800/30 hover:bg-orange-600/20 text-orange-400 hover:text-orange-300 border-orange-600/50 hover:border-orange-500 transition-all duration-200 backdrop-blur-sm"
                  >
                    <ChevronDown
                      className={`h-4 w-4 mr-2 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                    {isExpanded ? "Menos Detalhes" : "Mais Detalhes"}
                  </Button>
                </ModernCard>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPersons.map((person) => (
              <ModernCard
                key={person.id}
                className="p-4 hover:border-orange-500/50 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <Avatar
                    className="h-12 w-12 border-2 border-orange-500/50 flex-shrink-0"
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.login.username}`}
                    alt={person.name}
                  />
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
                    <div className="lg:col-span-2">
                      <p className="text-sm font-semibold text-orange-300">{person.name}</p>
                      <p className="text-xs text-neutral-400">@{person.login.username}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="text-sm text-white truncate">{person.personalContactEmail}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Telefone</p>
                      <p className="text-sm text-white">{person.contact?.phoneNumber}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 mb-1">Permissões</p>
                      <div className="flex flex-wrap gap-1">
                        {person.login.roles?.map((role, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-orange-600/20 text-orange-400 rounded-full text-xs border border-orange-600/50 backdrop-blur-sm"
                          >
                            {roleTypeLabels[role.role] || role.role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 lg:flex-col">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs bg-slate-800/30 hover:bg-green-600/20 text-green-400 hover:text-green-300 border-green-600/50 hover:border-green-500 backdrop-blur-sm"
                      onClick={() => openAddRolesModal(person.login.username, person.login.id, person.login.roles || [])}
                    >
                      <UserCog className="h-3 w-3 lg:mr-1" />
                      <span className="hidden lg:inline">Add</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs bg-slate-800/30 hover:bg-red-600/20 text-red-400 hover:text-red-300 border-red-600/50 hover:border-red-500 backdrop-blur-sm"
                      onClick={() => openRemoveRolesModal(person.login.username, person.login.id, person.login.roles || [])}
                    >
                      <UserCog className="h-3 w-3 lg:mr-1" />
                      <span className="hidden lg:inline">Rem</span>
                    </Button>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPersons.length === 0 && (
          <ModernCard className="text-center py-12 px-4">
            <div className="p-4 bg-slate-800/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-300 mb-2">
              {searchTerm || genderFilter !== "ALL" || roleFilter !== "ALL" || churchFilter !== "ALL" || maritalStatusFilter !== "ALL"
                ? "Nenhuma pessoa encontrada"
                : "Nenhuma pessoa cadastrada"}
            </h3>
            <p className="text-sm text-slate-400">
              {searchTerm || genderFilter !== "ALL" || roleFilter !== "ALL" || churchFilter !== "ALL" || maritalStatusFilter !== "ALL"
                ? "Tente ajustar os filtros de busca"
                : "As pessoas aparecerão aqui quando se cadastrarem"}
            </p>
          </ModernCard>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <ModernCard className="flex flex-col lg:flex-row justify-between items-center gap-4 p-4">
            <Button
              onClick={prevPage}
              disabled={currentPage === 0}
              variant="outline"
              className="w-full lg:w-auto bg-slate-800/30 hover:bg-orange-600/20 text-orange-400 hover:text-orange-300 border-orange-600/50 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
            >
              <ArrowLeftCircle className="h-4 w-4 mr-2" />
              <span>Anterior</span>
            </Button>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-slate-300 text-center order-first lg:order-none">
              <span className="text-sm whitespace-nowrap">
                Página <strong className="text-orange-400">{currentPage + 1}</strong> de{" "}
                <strong className="text-orange-400">{totalPages}</strong>
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                (
                {Math.min(currentPage * 12 + 1, totalElements)}-
                {Math.min((currentPage + 1) * 12, totalElements)} de {totalElements} itens)
              </span>
            </div>

            <Button
              onClick={nextPage}
              disabled={currentPage >= totalPages - 1}
              variant="outline"
              className="w-full lg:w-auto bg-slate-800/30 hover:bg-orange-600/20 text-orange-400 hover:text-orange-300 border-orange-600/50 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
            >
              <span>Próxima</span>
              <ArrowRightCircle className="h-4 w-4 ml-2" />
            </Button>
          </ModernCard>
        )}

        {/* Modais */}
        <AddRolesModal
          open={addRolesModalOpen}
          onClose={clearValuesFromAddRolesModal}
          userName={selectedUserName!}
          userId={selectedUserId!}
          currentRoles={selectedUserRoles}
          onSuccess={() => {
            clearValuesFromAddRolesModal();
            refreshPersons();
          }}
        />
        <RemoveRolesModal
          open={removeRolesModalOpen}
          onClose={clearValuesFromRemoveRolesModal}
          userName={selectedUserName!}
          userId={selectedUserId!}
          currentRoles={selectedUserRoles}
          onSuccess={() => {
            clearValuesFromRemoveRolesModal();
            refreshPersons();
          }}
        />
      </div>
    </div>
  );
}
