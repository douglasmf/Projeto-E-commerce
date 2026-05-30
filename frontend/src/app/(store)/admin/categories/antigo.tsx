'use client';

import {
useEffect,
useMemo,
useState,
} from 'react';

import {
FaEdit,
FaTrash,
} from 'react-icons/fa';

import { Container } from '@/components/layout/Container';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

import {
getCategories,
createCategory,
updateCategory,
deleteCategory,
Category,
} from '@/services/categories-service';

export default function AdminCategoriesPage() {
const [categories, setCategories] =
useState<Category[]>([]);

const [loading, setLoading] =
useState(true);

const [search, setSearch] =
useState('');

const [successMessage, setSuccessMessage] =
useState('');

const [errorMessage, setErrorMessage] =
useState('');

const [createModalOpen, setCreateModalOpen] =
useState(false);

const [editModalOpen, setEditModalOpen] =
useState(false);

const [deleteModalOpen, setDeleteModalOpen] =
useState(false);

const [selectedCategory, setSelectedCategory] =
useState<Category | null>(null);

const [categoryName, setCategoryName] =
useState('');

async function loadCategories() {
try {
setLoading(true);

const data =  
    await getCategories();  

  const ordered =  
    data.sort((a, b) =>  
      a.name.localeCompare(  
        b.name,  
      ),  
    );  

  setCategories(  
    ordered,  
  );  
} catch (error) {  
  console.log(error);  

  setErrorMessage(  
    'Erro ao carregar categorias.',  
  );  
} finally {  
  setLoading(false);  
}

}

useEffect(() => {
loadCategories();
}, []);

function clearMessages() {
setSuccessMessage('');
setErrorMessage('');
}

function resetForm() {
setCategoryName('');
}

function validateForm() {
if (
!categoryName.trim()
) {
setErrorMessage(
'Informe o nome da categoria.',
);

return false;  
}  

return true;

}

function openCreateModal() {
clearMessages();
resetForm();
setCreateModalOpen(true);
}

function openEditModal(
category: Category,
) {
clearMessages();

setSelectedCategory(  
  category,  
);  

setCategoryName(  
  category.name,  
);  

setEditModalOpen(true);

}

function openDeleteModal(
category: Category,
) {
clearMessages();

setSelectedCategory(  
  category,  
);  

setDeleteModalOpen(true);

}

async function handleCreateCategory() {
try {
clearMessages();

const isValid =  
    validateForm();  

  if (!isValid) {  
    return;  
  }  

  await createCategory({  
    name: categoryName,  
  });  

  setSuccessMessage(  
    'Categoria criada com sucesso.',  
  );  

  setCreateModalOpen(false);  

  resetForm();  

  loadCategories();  
} catch (error) {  
  console.log(error);  

  setErrorMessage(  
    'Erro ao criar categoria.',  
  );  
}

}

async function handleEditCategory() {
try {
clearMessages();

if (  
    !selectedCategory  
  ) {  
    return;  
  }  

  const isValid =  
    validateForm();  

  if (!isValid) {  
    return;  
  }  

  await updateCategory(  
    selectedCategory.id,  
    {  
      name: categoryName,  
    },  
  );  

  setSuccessMessage(  
    'Categoria atualizada com sucesso.',  
  );  

  setEditModalOpen(false);  

  loadCategories();  
} catch (error) {  
  console.log(error);  

  setErrorMessage(  
    'Erro ao atualizar categoria.',  
  );  
}

}

async function handleDeleteCategory() {
try {
clearMessages();

if (  
    !selectedCategory  
  ) {  
    return;  
  }  

  await deleteCategory(  
    selectedCategory.id,  
  );  

  setSuccessMessage(  
    'Categoria deletada com sucesso.',  
  );  

  setDeleteModalOpen(false);  

  loadCategories();  
} catch (error) {  
  console.log(error);  

  setErrorMessage(  
    'Erro ao deletar categoria.',  
  );  
}

}

const filteredCategories =
useMemo(() => {
return categories.filter(
(category) =>
category.name
.toLowerCase()
.includes(
search.toLowerCase(),
),
);
}, [
categories,
search,
]);

return (
<ProtectedRoute adminOnly>
    <main className="h-screen overflow-hidden bg-[#f4f4f5] pt-20">
    <Container>
        <div className="ml-0 p-4 md:ml-64 md:p-6">
        {/* TOPO */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
        <h1 className="text-3xl font-bold text-zinc-900">
        Categorias
        </h1>

        <div className="mt-3 h-1 w-28 rounded-full bg-zinc-800" />  
          </div>  

          <button  
            onClick={  
              openCreateModal  
            }  
            className="rounded-xl bg-zinc-900 px-5 py-3 font-semibold text-white transition hover:bg-zinc-700 cursor-pointer"  
          >  
            Nova Categoria  
          </button>  
        </div>  

        {/* ALERTAS */}  
        {successMessage && (  
          <div className="mb-6 rounded-xl border border-green-200 bg-green-100 p-4 text-sm font-medium text-green-700">  
            {successMessage}  
          </div>  
        )}  

        {errorMessage && (  
          <div className="mb-6 rounded-xl border border-red-200 bg-red-100 p-4 text-sm font-medium text-red-700">  
            {errorMessage}  
          </div>  
        )}  

        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:flex-row">  

          <input  
            type="text"  
            placeholder="Buscar categoria..."  
            value={search}  
            onChange={(e) =>  
              setSearch(  
                e.target.value,  
              )  
            }  
            className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-500"  
          />  
        </div>  

        {/* LISTAGEM */}  
        {loading ? (  
          <p className="text-zinc-400">  
            Carregando...  
          </p>  
        ) : (  
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">  
            {filteredCategories.map(  
              (category) => (  
                <div  
                  key={  
                    category.id  
                  }  
                  className="  
	        flex   
                    min-h-[220px]  
                    flex-col  
                    justify-between  
                    rounded-2xl  
                    border  
                    border-zinc-200  
                    bg-white p-4 shadow-sm  
                    transition-all  
                    duration-200  

    		hover:-translate-y-1  
    		hover:shadow-md  
	      "  
                >  
                  <div className="flex flex-1 items-center justify-center">  
                    <h2 className="text-center text-xl font-bold">  
                      {  
                        category.name  
                      }  
                    </h2>  
                  </div>  

                  <div className="mt-6 flex gap-2">  
                    <button  
                      onClick={() =>  
                        openEditModal(  
                          category,  
                        )  
                      }  
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer"  
                    >  
                      <FaEdit size={14} />  
                      Editar  
                    </button>  

                    <button  
                      onClick={() =>  
                        openDeleteModal(  
                          category,  
                        )  
                      }  
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 cursor-pointer"  
                    >  
                      <FaTrash size={14} />  
                      Deletar  
                    </button>  
                  </div>  
                </div>  
              ),  
            )}  
          </div>  
        )}  
      </div>  
    </Container>  

    {/* MODAL CREATE / EDIT */}  
    {(createModalOpen ||  
      editModalOpen) && (  
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">  
        <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">  
          <h2 className="mb-6 text-2xl font-bold text-white">  
            {createModalOpen  
              ? 'Nova Categoria'  
              : 'Editar Categoria'}  
          </h2>  

          <div>  
            <label className="mb-2 block text-sm font-medium text-zinc-300">  
              Nome  
            </label>  

            <input  
              type="text"  
              value={  
                categoryName  
              }  
              onChange={(e) =>  
                setCategoryName(  
                  e.target.value,  
                )  
              }  
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-zinc-500"  
            />  
          </div>  

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">  
            <button  
              onClick={() => {  
                setCreateModalOpen(  
                  false,  
                );  

                setEditModalOpen(  
                  false,  
                );  
              }}  
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white transition hover:bg-zinc-700 cursor-pointer"  
            >  
              Cancelar  
            </button>  

            <button  
              onClick={  
                createModalOpen  
                  ? handleCreateCategory  
                  : handleEditCategory  
              }  
              className="rounded-xl bg-white px-4 py-3 font-semibold text-zinc-900 transition hover:bg-zinc-200 cursor-pointer"  
            >  
              Salvar  
            </button>  
          </div>  
        </div>  
      </div>  
    )}  

    {/* MODAL DELETE */}  
    {deleteModalOpen && (  
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">  
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">  
          <h2 className="mb-4 text-2xl font-bold text-white">  
            Confirmar exclusão  
          </h2>  

          <p className="mb-6 text-zinc-300">  
            Deseja realmente deletar{' '}  
            <strong className="text-white">  
              {  
                selectedCategory?.name  
              }  
            </strong>  
            ?  
          </p>  

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">  
            <button  
              onClick={() =>  
                setDeleteModalOpen(  
                  false,  
                )  
              }  
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white transition hover:bg-zinc-700 cursor-pointer"  
            >  
              Cancelar  
            </button>  

            <button  
              onClick={  
                handleDeleteCategory  
              }  
              className="rounded-xl bg-red-600 px-4 py-3 text-white transition hover:bg-red-700 cursor-pointer"  
            >  
              Deletar  
            </button>  
          </div>  
        </div>  
      </div>  
    )}  
  </main>  
</ProtectedRoute>

);
}
