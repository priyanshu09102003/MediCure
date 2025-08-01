
export const metadata = {
  title: "Find Doctors - MediCure",
  description: "Browse and book appointments with top healthcare providers",
};
const SpecialityLayout = ({children}) =>{
    return(
        <div className="container mx-auto px-4 py-25">
            <div className="max-w-6xl mx-auto">
                    {children}
            </div>
        </div>
    )
}

export default SpecialityLayout;